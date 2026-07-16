import { Pago } from './pago';

export interface ItemOrden {
  id: number;
  camaraId: number;
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface Orden {
  id: number;
  total: number;
  estado: string;
  fechaCreacion: string;
  items: ItemOrden[];
  pago: Pago | null;
}
