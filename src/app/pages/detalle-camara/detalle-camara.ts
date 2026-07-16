import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CamaraService } from '../../services/camara.service';
import { CarritoService } from '../../services/carrito.service';
import { CamaraImagen } from '../../models/camara-imagen';
import { Camara } from '../../models/camara';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-detalle-camara',
  standalone: true,
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './detalle-camara.html',
  styleUrl: './detalle-camara.css',
})
export class DetalleCamara implements OnInit {
  private camaraService = inject(CamaraService);
  private carritoService = inject(CarritoService);
  private route = inject(ActivatedRoute);
  private notification = inject(NotificationService);

  loading = signal(false);
  error = signal('');
  mensajeExito = signal('');
  camara = signal<Camara | null>(null);
  imagenes = signal<CamaraImagen[]>([]);
  imagenActiva = signal<CamaraImagen | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.cargarDetalle(id);
    } else {
      this.error.set('ID de cámara no válido.');
    }
  }

  cargarDetalle(id: number): void {
    this.loading.set(true);
    this.error.set('');

    this.camaraService.obtenerPorId(id).subscribe({
      next: (data: Camara) => {
        this.camara.set(data);
        this.cargarImagenes(id, data);
      },
      error: (err: HttpErrorResponse) => {
        console.error(`Error al cargar la cámara con ID ${id}:`, err.message);
        this.error.set('No se pudo cargar el detalle de la cámara.');
        this.loading.set(false);
      }
    });
  }

  private cargarImagenes(id: number, camaraBase: Camara): void {
    this.camaraService.obtenerImagenes(id).subscribe({
      next: (imagenes) => {
        const combinadas = imagenes?.length ? imagenes : (camaraBase.imagenes ?? []);
        this.imagenes.set(combinadas);
        this.imagenActiva.set(this.seleccionarImagenPrincipal(combinadas));
        this.loading.set(false);
      },
      error: () => {
        const fallback = camaraBase.imagenes ?? [];
        this.imagenes.set(fallback);
        this.imagenActiva.set(this.seleccionarImagenPrincipal(fallback));
        this.loading.set(false);
      }
    });
  }

  seleccionarImagen(imagen: CamaraImagen): void {
    this.imagenActiva.set(imagen);
  }

  imagenActual(): CamaraImagen | null {
    return this.imagenActiva() ?? this.seleccionarImagenPrincipal(this.imagenes());
  }

  descripcionResumen(camara: Camara): string {
    return camara.descripcion?.trim()
      || `${camara.marca} ${camara.modelo} con resolución ${camara.resolucion}, pensada para una vigilancia clara y estable.`;
  }

  etiquetaStock(stock: number): string {
    if (stock <= 0) return 'Agotada';
    if (stock <= 3) return `Últimas ${stock} unidades`;
    return `${stock} unidades disponibles`;
  }

  private seleccionarImagenPrincipal(imagenes: CamaraImagen[]): CamaraImagen | null {
    return imagenes.find((imagen) => imagen.esPrincipal) ?? imagenes[0] ?? null;
  }

  placeholderImagen(): string {
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#1a1a2e"/>
            <stop offset="100%" stop-color="#e94560"/>
          </linearGradient>
        </defs>
        <rect width="900" height="600" rx="36" fill="url(#g)"/>
        <circle cx="690" cy="150" r="110" fill="rgba(255,255,255,0.09)"/>
        <circle cx="210" cy="450" r="170" fill="rgba(255,255,255,0.06)"/>
        <g fill="#fff">
          <rect x="290" y="185" width="320" height="220" rx="32" fill="rgba(255,255,255,0.13)" stroke="rgba(255,255,255,0.3)"/>
          <circle cx="450" cy="295" r="72" fill="rgba(255,255,255,0.9)"/>
          <circle cx="450" cy="295" r="34" fill="#1a1a2e"/>
          <rect x="360" y="110" width="180" height="70" rx="24" fill="rgba(255,255,255,0.18)"/>
          <text x="450" y="500" text-anchor="middle" font-size="30" font-family="Arial, sans-serif">CamShop · Cámara de seguridad</text>
        </g>
      </svg>
    `);
  }

  agregarAlCarrito(): void {
    const cam = this.camara();
    if (!cam) return;

    this.carritoService.agregar(cam.id, 1).subscribe({
      next: (data) => {
        this.carritoService.setCarrito(data);
        this.mensajeExito.set('');
        this.notification.exito('Cámara agregada', `${cam.marca} ${cam.modelo} ya está en tu carrito.`);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al agregar al carrito:', err.message);
        this.error.set('No se pudo agregar al carrito.');
        this.notification.error('No se pudo agregar', 'Revisa tu sesión o el stock disponible.');
      }
    });
  }
}
