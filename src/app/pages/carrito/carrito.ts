import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarritoService } from '../../services/carrito.service';
import { OrdenService } from '../../services/orden.service';
import { AuthService } from '../../services/auth.service';
import { ItemCarritoComponent } from '../../components/item-carrito/item-carrito';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, ItemCarritoComponent],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {
  private fb = inject(FormBuilder);
  private carritoService = inject(CarritoService);
  private ordenService = inject(OrdenService);
  private authService = inject(AuthService);
  private notification = inject(NotificationService);

  loading = signal(false);
  procesandoPago = signal(false);
  error = signal('');
  exito = signal('');
  items = this.carritoService.items;
  total = this.carritoService.total;
  cantidad = this.carritoService.cantidad;
  cliente = this.authService.cliente;

  metodoPagoForm = this.fb.nonNullable.group({ metodo: ['tarjeta', Validators.required] });

  metodoInfo: Record<string, { title: string; description: string; label: string }> = {
    tarjeta: { title: 'Tarjeta', description: 'Aprobación simulada y confirmación inmediata.', label: 'Pago rápido' },
    yape: { title: 'Yape', description: 'Pago móvil simulado con aprobación inmediata.', label: 'Pago móvil' },
    efectivo: { title: 'Efectivo', description: 'Pago simulado para una venta asistida.', label: 'Contraentrega' },
  };

  ngOnInit(): void { this.cargarCarrito(); }

  cargarCarrito(): void {
    this.loading.set(true);
    this.carritoService.obtenerCarrito().subscribe({
      next: data => { this.carritoService.setCarrito(data); this.loading.set(false); },
      error: err => { this.error.set(err.error?.message ?? 'No se pudo cargar el carrito.'); this.loading.set(false); }
    });
  }

  onEliminar(id: number): void {
    this.carritoService.eliminar(id).subscribe({
      next: data => this.carritoService.setCarrito(data),
      error: err => {
        const mensaje = err.error?.message ?? 'No se pudo eliminar el producto.';
        this.error.set(mensaje); this.notification.error('No se pudo eliminar', mensaje);
      }
    });
  }

  onActualizar(evento: { id: number; cantidad: number }): void {
    this.carritoService.actualizarCantidad(evento.id, evento.cantidad).subscribe({
      next: data => this.carritoService.setCarrito(data),
      error: err => {
        const mensaje = err.error?.message ?? 'No se pudo actualizar la cantidad.';
        this.error.set(mensaje); this.notification.error('Cantidad no actualizada', mensaje);
      }
    });
  }

  onVaciar(): void {
    this.carritoService.vaciarCarrito().subscribe({
      next: () => { this.carritoService.vaciar(); this.notification.info('Carrito vacío'); },
      error: err => {
        const mensaje = err.error?.message ?? 'No se pudo vaciar el carrito.';
        this.error.set(mensaje); this.notification.error('No se pudo vaciar', mensaje);
      }
    });
  }

  procesarPago(): void {
    if (!this.cliente()) {
      this.error.set('Completa primero tus datos de cliente para continuar.');
      this.notification.info('Completa tu perfil', 'Necesitamos tus datos antes de registrar la orden.');
      return;
    }
    if (this.metodoPagoForm.invalid || this.items().length === 0) return;

    this.procesandoPago.set(true);
    this.error.set('');
    this.exito.set('');
    const metodo = this.metodoPagoForm.getRawValue().metodo;

    this.ordenService.checkout(metodo).subscribe({
      next: orden => {
        this.carritoService.vaciar();
        this.exito.set(`Orden #${orden.id} registrada. Pago ${orden.pago?.estado ?? orden.estado}.`);
        this.notification.exito(`Orden #${orden.id} registrada`, 'El pago simulado fue procesado correctamente.');
        this.procesandoPago.set(false);
      },
      error: err => {
        this.error.set(err.error?.message ?? 'No se pudo registrar la compra.');
        this.notification.error('No se pudo completar la compra', this.error());
        this.procesandoPago.set(false);
      }
    });
  }
}
