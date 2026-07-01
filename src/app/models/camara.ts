import { CamaraImagen } from './camara-imagen';

export interface Camara {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenes: CamaraImagen[];
}