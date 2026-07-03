export interface Pago {
  ordenId: number | null;
  metodo: string | null;
  monto: number | null;
  observacion?: string | null; 
}