import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Orden } from '../models/orden';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  private http = inject(HttpClient);
  // Ruta base para órdenes - usar /api/ordenes para mantener consistencia
  private apiUrl = `${environment.apiUrl}/api/ordenes`;

  checkout(metodo: string): Observable<Orden> {

    return this.http.post<Orden>(
      `${this.apiUrl}/checkout?metodo=${metodo}`,
      {}
    );

  }

  listarMias(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${this.apiUrl}/mias`);
  }

  listarTodas(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.apiUrl);
  }

  actualizarEstado(id: number, estado: string): Observable<Orden> {
    return this.http.patch<Orden>(`${this.apiUrl}/${id}/estado?estado=${encodeURIComponent(estado)}`, {});
  }
}
