export interface Pago {
  id?: number;
  ordenId: number;
  metodo: string;
  monto: number;
  observacion?: string;
}