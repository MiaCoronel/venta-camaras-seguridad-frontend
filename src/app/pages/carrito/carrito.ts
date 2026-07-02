import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';
import { ItemCarritoComponent } from '../../components/item-carrito/item-carrito';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterLink, DecimalPipe, ItemCarritoComponent],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {
  private carritoService = inject(CarritoService);

  loading = signal(false);
  error = signal('');

  items = this.carritoService.items;
  total = this.carritoService.total;
  cantidad = this.carritoService.cantidad;

  ngOnInit(): void {
    this.cargarCarrito();
  }

  cargarCarrito(): void {
    this.loading.set(true);
    this.error.set('');
    this.carritoService.obtenerCarrito().subscribe({
      next: (data) => {
        this.carritoService.setCarrito(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar carrito:', err);
        this.error.set('No se pudo cargar el carrito.');
        this.loading.set(false);
      }
    });
  }

  onEliminar(id: number): void {
    this.carritoService.eliminar(id).subscribe({
      next: (data) => this.carritoService.setCarrito(data),
      error: (err) => console.error('Error al eliminar:', err)
    });
  }

  onActualizar(evento: { id: number; cantidad: number }): void {
    this.carritoService.actualizarCantidad(evento.id, evento.cantidad).subscribe({
      next: (data) => this.carritoService.setCarrito(data),
      error: (err) => console.error('Error al actualizar:', err)
    });
  }

  onVaciar(): void {
    this.carritoService.vaciarCarrito().subscribe({
      next: () => this.carritoService.vaciar(),
      error: (err) => console.error('Error al vaciar carrito:', err)
    });
  }
}