export interface CamaraResumen {
  id: number;
  nombre: string;
}

export interface ClienteResumen {
  id: number;
  nombre: string;
}

export interface Resena {
  id: number;
  calificacion: number;
  comentario: string;
  fechaCreacion: string;
  camara: CamaraResumen;
  cliente: ClienteResumen;
}

// DTO usado al registrar una reseña (POST /api/resenas/camara/{camaraId})
export interface ResenaDTO {
  calificacion: number;
  comentario: string;
}
