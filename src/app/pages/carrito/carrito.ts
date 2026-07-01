import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarritoService } from '../../services/carrito.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.html', 
  styleUrl: './carrito.css'
})
export class CarritoComponent {
  // Inyectamos el servicio del carrito
  private carritoService = inject(CarritoService);

  loading = signal(false);
  error = signal('');

  items = this.carritoService.items$;
  total = this.carritoService.total;

  eliminarItem(id: number) {
    this.carritoService.eliminar(id);
  }

  actualizarCantidad(id: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const nuevaCantidad = parseInt(input.value);
    this.carritoService.actualizarCantidad(id, nuevaCantidad);
  }
}
