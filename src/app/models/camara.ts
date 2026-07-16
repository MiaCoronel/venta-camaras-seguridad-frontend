import { CamaraImagen } from './camara-imagen';
import { Categoria } from './categoria';

export interface Camara {
  id: number;
  marca: string;
  modelo: string;
  nombre: string;
  resolucion: string;
  precio: number;
  stock: number;
  descripcion?: string;
  activo?: boolean;
  agotada?: boolean;
  categoria?: Categoria | null;
  imagenes?: CamaraImagen[];
}

export interface CamaraPayload {
  marca: string;
  modelo: string;
  nombre: string;
  resolucion: string;
  descripcion?: string;
  precio: number;
  stock: number;
  categoriaId?: number | null;
}
