import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pago } from '../models/pago';

@Injectable({ providedIn: 'root' })
export class PagoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/pagos`;

  obtenerTodos(): Observable<Pago[]> { return this.http.get<Pago[]>(this.apiUrl); }
  obtenerPorId(id: number): Observable<Pago> { return this.http.get<Pago>(`${this.apiUrl}/${id}`); }
  obtenerPorOrden(ordenId: number): Observable<Pago> { return this.http.get<Pago>(`${this.apiUrl}/orden/${ordenId}`); }
  buscarPorEstadoYMonto(estado: string, montoMinimo: number): Observable<Pago[]> {
    return this.http.get<Pago[]>(`${this.apiUrl}/buscar?estado=${encodeURIComponent(estado)}&montoMinimo=${montoMinimo}`);
  }
}
