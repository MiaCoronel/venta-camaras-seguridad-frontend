import { Injectable, signal, computed } from '@angular/core';
import { ItemCarrito } from '../models/item-carrito';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private items = signal<ItemCarrito[]>([]);

  items$ = this.items.asReadonly();

  total = computed(() => this.items().reduce((acc, item) => acc + (item.precio * item.cantidad), 0));

  agregar(item: ItemCarrito) {
    this.items.update(list => {
      const existe = list.find(i => i.id === item.id);
      return existe ? list.map(i => i.id === item.id ? { ...i, cantidad: i.cantidad + 1 } : i) : [...list, item];
    });
  }

  eliminar(id: number) {
    this.items.update(list => list.filter(i => i.id !== id));
  }

  actualizarCantidad(id: number, cantidad: number) {
    this.items.update(list => list.map(i => i.id === id ? { ...i, cantidad } : i));
  }
}
