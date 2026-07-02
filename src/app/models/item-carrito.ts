import { Camara } from './camara';

export interface ItemCarrito {
  id: number;
  camara: Camara;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}
