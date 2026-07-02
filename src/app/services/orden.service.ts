import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orden } from '../models/orden';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  private http = inject(HttpClient);

  private readonly apiUrl = 'http://localhost:8080/api/ordenes';

  obtenerTodos(): Observable<Orden[]> {
    return this.http.get<Orden[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Orden> {
    return this.http.get<Orden>(`${this.apiUrl}/${id}`);
  }

  crear(orden: Orden): Observable<Orden> {
    return this.http.post<Orden>(this.apiUrl, orden);
  }

  actualizar(id: number, orden: Orden): Observable<Orden> {
    return this.http.put<Orden>(`${this.apiUrl}/${id}`, orden);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
