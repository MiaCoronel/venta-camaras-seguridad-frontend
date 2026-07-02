import { ItemCarrito } from './item-carrito';

export interface Carrito {
  id: number;
  items: ItemCarrito[];
  total: number;
}