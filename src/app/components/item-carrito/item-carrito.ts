import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ItemCarrito } from '../../models/item-carrito';

@Component({
  selector: 'app-item-carrito',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './item-carrito.html',
  styleUrl: './item-carrito.css'
})
export class ItemCarritoComponent {
  @Input() item!: ItemCarrito;
  @Output() eliminar = new EventEmitter<number>();
  @Output() actualizar = new EventEmitter<{ id: number; cantidad: number }>();

  onEliminar(): void {
    this.eliminar.emit(this.item.id);
  }

  onAumentar(): void {
    this.actualizar.emit({ id: this.item.id, cantidad: this.item.cantidad + 1 });
  }

  onDisminuir(): void {
    this.actualizar.emit({ id: this.item.id, cantidad: this.item.cantidad - 1 });
  }
}
