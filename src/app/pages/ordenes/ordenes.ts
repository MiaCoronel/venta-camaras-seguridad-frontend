import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { OrdenService } from '../../services/orden.service';
import { Orden } from '../../models/orden';

@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
  templateUrl: './ordenes.html',
  styleUrl: './ordenes.css'
})
export class Ordenes implements OnInit {
  private ordenService = inject(OrdenService);

  ordenes = signal<Orden[]>([]);
  loading = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes(): void {
    this.loading.set(true);
    this.error.set('');

    this.ordenService.obtenerTodos().subscribe({
      next: (data: Orden[]) => {
        this.ordenes.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar órdenes:', err.message);
        this.error.set('No fue posible cargar las órdenes.');
        this.loading.set(false);
      }
    });
  }
}