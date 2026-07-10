import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Resena, ResenaDTO } from '../models/resena';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ResenaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/resenas`;

  // --- ESTÁNDAR DE SERVICES OBLIGATORIO ---
  // El backend expone las reseñas siempre asociadas a una cámara,
  // por eso obtenerTodos/crear reciben el camaraId.

  obtenerTodos(camaraId: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/camara/${camaraId}`);
  }

  obtenerPorId(id: number): Observable<Resena> {
    return this.http.get<Resena>(`${this.apiUrl}/${id}`);
  }

  crear(camaraId: number, resena: ResenaDTO): Observable<Resena> {
    return this.http.post<Resena>(`${this.apiUrl}/camara/${camaraId}`, resena);
  }

  actualizar(id: number, resena: ResenaDTO): Observable<Resena> {
    // El backend aún no expone PUT /api/resenas/{id}; se deja implementado
    // para cumplir el estándar de Services. Coordinar con backend si se
    // necesita edición de reseñas.
    return this.http.put<Resena>(`${this.apiUrl}/${id}`, resena);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // --- Métodos adicionales usados por la página de reseñas ---

  obtenerPromedio(camaraId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/camara/${camaraId}/promedio`);
  }
}
