import { Cliente } from './cliente';
import { Pago } from './pago';
import { ItemCarrito } from './item-carrito';

export interface HistorialCompra {
  id: number;
  fecha: string;
  total: number;
  estado: string;
  metodoPago: string;
  cliente: Cliente | null;
  pago: Pago;
  items: ItemCarrito[];
}

