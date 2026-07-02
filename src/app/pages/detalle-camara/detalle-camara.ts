import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CamaraService } from '../../services/camara.service';
import { CarritoService } from '../../services/carrito.service';
import { Camara } from '../../models/camara';

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

  loading = signal(false);
  error = signal('');
  mensajeExito = signal('');
  camara = signal<Camara | null>(null);

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
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error(`Error al cargar la cámara con ID ${id}:`, err.message);
        this.error.set('No se pudo cargar el detalle de la cámara.');
        this.loading.set(false);
      }
    });
  }

  agregarAlCarrito(): void {
    const cam = this.camara();
    if (!cam) return;

    this.carritoService.agregar(cam.id, 1).subscribe({
      next: (data) => {
        this.carritoService.setCarrito(data);
        this.mensajeExito.set('✅ Cámara agregada al carrito!');
        setTimeout(() => this.mensajeExito.set(''), 3000);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al agregar al carrito:', err.message);
        this.error.set('No se pudo agregar al carrito.');
      }
    });
  }
}