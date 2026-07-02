import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CamaraService } from '../../services/camara.service';
import { Camara } from '../../models/camara';

@Component({
  selector: 'app-detalle-camara',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './detalle-camara.html',
  styleUrl: './detalle-camara.css',
})
export class DetalleCamara implements OnInit {
  camaraService = inject(CamaraService);
  private route = inject(ActivatedRoute);

  // --- ESTÁNDAR DE COMPONENTES OBLIGATORIO ---
  loading = signal(false);
  error = signal('');
  
  // Signal que almacena UNA SOLA cámara (o null mientras carga)
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
      // Definimos explícitamente que 'data' es una única Camara
      next: (data: Camara) => {
        this.camara.set(data);
        this.loading.set(false);
      },
      // Definimos explícitamente que 'err' es un HttpErrorResponse
      error: (err: HttpErrorResponse) => {
        console.error(`Error al cargar la cámara con ID ${id}:`, err.message);
        this.error.set('No se pudo cargar el detalle de la cámara.');
        this.loading.set(false);
      }
    });
  }
}