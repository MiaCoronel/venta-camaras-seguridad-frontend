export interface ProductoVendido {
  camaraId: number | null;
  nombre: string;
  unidades: number;
  ingresos: number;
}

export interface DashboardResumen {
  camarasActivas: number;
  usuarios: number;
  pedidos: number;
  unidadesStock: number;
  ingresos: number;
  ticketPromedio: number;
  pedidosPorEstado: Record<string, number>;
  masVendidas: ProductoVendido[];
}
