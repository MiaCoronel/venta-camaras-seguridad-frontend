import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Camara } from '../models/camara';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CamaraService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/camaras`;

  obtenerTodos(): Observable<Camara[]> {
    return this.http.get<Camara[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Camara> {
    return this.http.get<Camara>(`${this.apiUrl}/${id}`);
  }

  crear(camara: Camara): Observable<Camara> {
    return this.http.post<Camara>(this.apiUrl, camara);
  }

  actualizar(id: number, camara: Camara): Observable<Camara> {
    return this.http.put<Camara>(`${this.apiUrl}/${id}`, camara);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}