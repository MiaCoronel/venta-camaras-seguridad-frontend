import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CamaraService } from '../../services/camara.service';
import { TarjetaCamara } from '../../components/tarjeta-camara/tarjeta-camara';
import { Camara } from '../../models/camara';

@Component({
  selector: 'app-camaras',
  standalone: true,
  imports: [TarjetaCamara],
  templateUrl: './camaras.html',
  styleUrl: './camaras.css',
})
export class Camaras implements OnInit {
  camaraService = inject(CamaraService);

  // --- ESTÁNDAR DE COMPONENTES OBLIGATORIO ---
  loading = signal(false);
  error = signal('');
  
  // Signal que almacena un ARREGLO de cámaras
  camaras = signal<Camara[]>([]);

  ngOnInit(): void {
    this.cargarCatalogo();
  }

  cargarCatalogo(): void {
    this.loading.set(true);
    this.error.set('');

    this.camaraService.obtenerTodos().subscribe({
      // Definimos explícitamente que 'data' es un arreglo de Camara
      next: (data: Camara[]) => {
        this.camaras.set(data);
        this.loading.set(false);
      },
      // Definimos explícitamente que 'err' es un HttpErrorResponse
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar las cámaras:', err.message);
        this.error.set('Error al conectar con el servidor.');
        this.loading.set(false);
      }
    });
  }
}