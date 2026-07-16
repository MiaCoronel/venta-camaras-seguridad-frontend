export interface Pago {
  id?: number; // id añadido para identificar el pago en las vistas
  ordenId: number | null;
  metodo: string | null;
  monto: number | null;
  estado?: string | null; // estado añadido (APROBADO, PENDIENTE, RECHAZADO...)
  observacion?: string | null;
}
