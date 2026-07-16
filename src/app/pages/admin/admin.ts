import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../services/admin.service';
import { CamaraService } from '../../services/camara.service';
import { CategoriaService } from '../../services/categoria.service';
import { ClienteService } from '../../services/cliente.service';
import { OrdenService } from '../../services/orden.service';
import { Camara, CamaraPayload } from '../../models/camara';
import { Categoria } from '../../models/categoria';
import { Cliente } from '../../models/cliente';
import { Orden } from '../../models/orden';
import { User } from '../../models/usuario';
import { DashboardResumen } from '../../models/dashboard';

type Modulo = 'dashboard' | 'catalogo' | 'categorias' | 'inventario' | 'imagenes' | 'usuarios' | 'pedidos';

@Component({
  selector: 'app-admin', standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin.html', styleUrl: './admin.css'
})
export class Admin implements OnInit {
  private fb = inject(FormBuilder);
  private adminService = inject(AdminService);
  private camaraService = inject(CamaraService);
  private categoriaService = inject(CategoriaService);
  private clienteService = inject(ClienteService);
  private ordenService = inject(OrdenService);

  modulo = signal<Modulo>('dashboard');
  loading = signal(false); error = signal(''); exito = signal('');
  camaras = signal<Camara[]>([]); categorias = signal<Categoria[]>([]);
  usuarios = signal<User[]>([]); clientes = signal<Cliente[]>([]); ordenes = signal<Orden[]>([]);
  dashboard = signal<DashboardResumen | null>(null);
  editandoCamaraId = signal<number | null>(null); editandoCategoriaId = signal<number | null>(null);
  archivo = signal<File | null>(null);
  placeholder = 'https://placehold.co/640x420/e8edf5/334155?text=Sin+imagen';

  camaraForm = this.fb.group({
    nombre: ['', Validators.required], marca: ['', Validators.required], modelo: ['', Validators.required],
    resolucion: ['', Validators.required], descripcion: [''],
    precio: [0, [Validators.required, Validators.min(0.01)]],
    stock: [0, [Validators.required, Validators.min(0)]], categoriaId: [null as number | null]
  });
  categoriaForm = this.fb.group({ nombre: ['', Validators.required], descripcion: [''] });
  imagenForm = this.fb.group({
    camaraId: [0, [Validators.required, Validators.min(1)]],
    numImagen: [1, [Validators.required, Validators.min(1)]], esPrincipal: [true]
  });

  ngOnInit(): void { this.cargarTodo(); }

  seleccionar(modulo: Modulo): void { this.modulo.set(modulo); this.limpiarMensajes(); }

  cargarTodo(): void {
    this.loading.set(true); this.error.set('');
    forkJoin({
      camaras: this.adminService.listarCamaras(), categorias: this.categoriaService.listar(),
      usuarios: this.adminService.listarUsuarios(), clientes: this.clienteService.obtenerTodos(),
      ordenes: this.ordenService.listarTodas()
      , dashboard: this.adminService.obtenerDashboard()
    }).subscribe({
      next: data => {
        this.camaras.set(data.camaras); this.categorias.set(data.categorias);
        this.usuarios.set(data.usuarios); this.clientes.set(data.clientes); this.ordenes.set(data.ordenes);
        this.dashboard.set(data.dashboard);
        this.loading.set(false);
      },
      error: err => { this.error.set(err.error?.message ?? 'No se pudo cargar el panel administrativo.'); this.loading.set(false); }
    });
  }

  guardarCamara(): void {
    if (this.camaraForm.invalid) { this.camaraForm.markAllAsTouched(); return; }
    const v = this.camaraForm.getRawValue();
    const payload: CamaraPayload = {
      nombre: v.nombre!.trim(), marca: v.marca!.trim(), modelo: v.modelo!.trim(),
      resolucion: v.resolucion!.trim(), descripcion: v.descripcion?.trim() || '',
      precio: Number(v.precio), stock: Number(v.stock), categoriaId: v.categoriaId
    };
    const id = this.editandoCamaraId();
    const peticion = id == null ? this.camaraService.crear(payload) : this.camaraService.actualizar(id, payload);
    peticion.subscribe({
      next: camara => {
        this.exito.set(`Cámara “${camara.nombre}” guardada correctamente.`);
        this.cancelarEdicionCamara(); this.imagenForm.patchValue({ camaraId: camara.id }); this.cargarTodo();
      },
      error: err => this.error.set(err.error?.message ?? 'No se pudo guardar la cámara.')
    });
  }

  editarCamara(c: Camara): void {
    this.editandoCamaraId.set(c.id);
    this.camaraForm.reset({ nombre: c.nombre, marca: c.marca, modelo: c.modelo,
      resolucion: c.resolucion, descripcion: c.descripcion ?? '', precio: c.precio,
      stock: c.stock, categoriaId: c.categoria?.id ?? null });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicionCamara(): void {
    this.editandoCamaraId.set(null);
    this.camaraForm.reset({ nombre: '', marca: '', modelo: '', resolucion: '', descripcion: '', precio: 0, stock: 0, categoriaId: null });
  }

  cambiarEstadoCamara(c: Camara): void {
    this.camaraService.cambiarEstado(c.id, c.activo === false).subscribe({
      next: () => { this.exito.set(c.activo === false ? 'Cámara reactivada.' : 'Cámara dada de baja sin borrar su historial.'); this.cargarTodo(); },
      error: err => this.error.set(err.error?.message ?? 'No se pudo cambiar el estado.')
    });
  }

  guardarCategoria(): void {
    if (this.categoriaForm.invalid) { this.categoriaForm.markAllAsTouched(); return; }
    const v = this.categoriaForm.getRawValue();
    const data = { nombre: v.nombre!.trim(), descripcion: v.descripcion?.trim() || '', activo: true };
    const id = this.editandoCategoriaId();
    const peticion = id == null ? this.categoriaService.crear(data) : this.categoriaService.actualizar(id, data);
    peticion.subscribe({ next: () => { this.exito.set('Categoría guardada.'); this.cancelarCategoria(); this.cargarTodo(); },
      error: err => this.error.set(err.error?.message ?? 'No se pudo guardar la categoría.') });
  }

  editarCategoria(c: Categoria): void { this.editandoCategoriaId.set(c.id); this.categoriaForm.patchValue(c); }
  cancelarCategoria(): void { this.editandoCategoriaId.set(null); this.categoriaForm.reset({ nombre: '', descripcion: '' }); }
  cambiarEstadoCategoria(c: Categoria): void {
    this.categoriaService.cambiarEstado(c.id, c.activo === false).subscribe({ next: () => this.cargarTodo(), error: () => this.error.set('No se pudo actualizar la categoría.') });
  }

  registrarEntrada(id: number, valor: string): void {
    const cantidad = Number(valor);
    if (!Number.isInteger(cantidad) || cantidad <= 0) { this.error.set('Ingresa una cantidad de lote válida.'); return; }
    this.camaraService.registrarEntrada(id, cantidad).subscribe({ next: () => { this.exito.set(`Entrada de ${cantidad} unidades registrada.`); this.cargarTodo(); }, error: err => this.error.set(err.error?.message ?? 'No se actualizó el stock.') });
  }

  marcarAgotada(id: number): void {
    this.camaraService.establecerStock(id, 0).subscribe({ next: () => { this.exito.set('Producto marcado como agotado.'); this.cargarTodo(); }, error: () => this.error.set('No se pudo actualizar el stock.') });
  }

  seleccionarArchivo(event: Event): void { this.archivo.set((event.target as HTMLInputElement).files?.[0] ?? null); }
  subirImagen(): void {
    if (this.imagenForm.invalid || !this.archivo()) { this.error.set('Selecciona una cámara y un archivo de imagen.'); return; }
    const v = this.imagenForm.getRawValue();
    this.camaraService.subirImagen(Number(v.camaraId), this.archivo()!, Number(v.numImagen), Boolean(v.esPrincipal)).subscribe({
      next: () => { this.exito.set('Imagen subida correctamente.'); this.archivo.set(null); this.cargarTodo(); },
      error: err => this.error.set(err.error?.message ?? 'No se pudo subir la imagen.')
    });
  }
  principal(id: number): void { this.camaraService.marcarPrincipal(id).subscribe({ next: () => this.cargarTodo(), error: () => this.error.set('No se pudo cambiar la imagen principal.') }); }
  eliminarImagen(id: number): void { this.camaraService.eliminarImagen(id).subscribe({ next: () => { this.exito.set('Imagen eliminada correctamente.'); this.cargarTodo(); }, error: err => this.error.set(err.error?.message ?? 'No se pudo eliminar la imagen.') }); }

  cambiarEstadoUsuario(u: User): void { this.adminService.cambiarEstado(u.id, !u.enabled).subscribe({ next: () => this.cargarTodo(), error: () => this.error.set('No se pudo actualizar la cuenta.') }); }
  cambiarRol(u: User, event: Event): void { this.adminService.cambiarRol(u.id, (event.target as HTMLSelectElement).value).subscribe({ next: () => this.cargarTodo(), error: () => this.error.set('No se pudo asignar el rol.') }); }
  cambiarEstadoPedido(o: Orden, event: Event): void { this.ordenService.actualizarEstado(o.id, (event.target as HTMLSelectElement).value).subscribe({ next: () => this.cargarTodo(), error: err => this.error.set(err.error?.message ?? 'No se pudo actualizar el pedido.') }); }

  stockTotal(): number { return this.camaras().filter(c => c.activo !== false).reduce((s, c) => s + c.stock, 0); }
  activas(): number { return this.camaras().filter(c => c.activo !== false).length; }
  agotadas(): number { return this.camaras().filter(c => c.activo !== false && c.stock === 0).length; }
  maxVentas(): number { return Math.max(1, ...(this.dashboard()?.masVendidas.map(p => p.unidades) ?? [1])); }
  clienteDe(userId: number): Cliente | undefined { return this.clientes().find(c => c.userId === userId); }
  private limpiarMensajes(): void { this.error.set(''); this.exito.set(''); }
}
