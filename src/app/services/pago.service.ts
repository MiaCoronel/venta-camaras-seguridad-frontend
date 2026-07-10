import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pago } from '../models/pago';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private http = inject(HttpClient);
<<<<<<< HEAD

  private apiUrl = `${environment.apiUrl}/pagos`;
=======
  private apiUrl = `${environment.apiUrl}/api/pagos`;
>>>>>>> 04a6cd4 (feat: carrito completo con backend, item-carrito component, detalle-camara actualizado)

  obtenerTodos(): Observable<Pago[]> {
    return this.http.get<Pago[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Pago> {
    return this.http.get<Pago>(`${this.apiUrl}/${id}`);
  }

  obtenerPorOrden(ordenId: number): Observable<Pago> {
    return this.http.get<Pago>(
      `${this.apiUrl}/orden/${ordenId}`
    );
  }

  buscarPorEstadoYMonto(
    estado: string,
    montoMinimo: number
  ): Observable<Pago[]> {

    return this.http.get<Pago[]>(
      `${this.apiUrl}/buscar?estado=${estado}&montoMinimo=${montoMinimo}`
    );

  }
}