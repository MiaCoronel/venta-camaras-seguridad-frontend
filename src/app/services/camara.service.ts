import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Camara, CamaraPayload } from '../models/camara';
import { CamaraImagen } from '../models/camara-imagen';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CamaraService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/camaras`;

  obtenerTodos(filtros?: { categoriaId?: number | null; marca?: string; precioMin?: number | null; precioMax?: number | null; soloStock?: boolean }): Observable<Camara[]> {
    let params = new HttpParams();
    if (filtros?.categoriaId) params = params.set('categoriaId', filtros.categoriaId);
    if (filtros?.marca?.trim()) params = params.set('marca', filtros.marca.trim());
    if (filtros?.precioMin != null) params = params.set('precioMin', filtros.precioMin);
    if (filtros?.precioMax != null) params = params.set('precioMax', filtros.precioMax);
    if (filtros?.soloStock) params = params.set('soloStock', true);
    return this.http.get<Camara[]>(this.apiUrl, { params });
  }
  obtenerPorId(id: number): Observable<Camara> { return this.http.get<Camara>(`${this.apiUrl}/${id}`); }
  crear(camara: CamaraPayload): Observable<Camara> { return this.http.post<Camara>(this.apiUrl, camara); }
  actualizar(id: number, camara: CamaraPayload): Observable<Camara> { return this.http.put<Camara>(`${this.apiUrl}/${id}`, camara); }
  darDeBaja(id: number): Observable<Camara> { return this.http.delete<Camara>(`${this.apiUrl}/${id}`); }
  cambiarEstado(id: number, activo: boolean): Observable<Camara> { return this.http.patch<Camara>(`${this.apiUrl}/${id}/estado?activo=${activo}`, {}); }
  registrarEntrada(id: number, cantidad: number): Observable<Camara> { return this.http.patch<Camara>(`${this.apiUrl}/${id}/stock/entrada?cantidad=${cantidad}`, {}); }
  establecerStock(id: number, cantidad: number): Observable<Camara> { return this.http.put<Camara>(`${this.apiUrl}/${id}/stock?cantidad=${cantidad}`, {}); }

  obtenerImagenes(camaraId: number): Observable<CamaraImagen[]> { return this.http.get<CamaraImagen[]>(`${this.apiUrl}/${camaraId}/imagenes`); }
  obtenerImagenPrincipal(camaraId: number): Observable<CamaraImagen | null> { return this.http.get<CamaraImagen | null>(`${this.apiUrl}/${camaraId}/imagenes/principal`); }
  agregarImagen(camaraId: number, imagen: Omit<CamaraImagen, 'id'>): Observable<CamaraImagen> { return this.http.post<CamaraImagen>(`${this.apiUrl}/${camaraId}/imagenes`, imagen); }
  subirImagen(camaraId: number, archivo: File, numImagen: number, esPrincipal: boolean): Observable<CamaraImagen> {
    const data = new FormData(); data.append('archivo', archivo);
    return this.http.post<CamaraImagen>(`${this.apiUrl}/${camaraId}/imagenes/upload?numImagen=${numImagen}&esPrincipal=${esPrincipal}`, data);
  }
  marcarPrincipal(id: number): Observable<CamaraImagen> { return this.http.patch<CamaraImagen>(`${this.apiUrl}/imagenes/${id}/principal`, {}); }
  eliminarImagen(id: number): Observable<void> { return this.http.delete<void>(`${this.apiUrl}/imagenes/${id}`); }
  actualizarImagen(id: number, imagen: Partial<CamaraImagen>): Observable<CamaraImagen> { return this.http.put<CamaraImagen>(`${this.apiUrl}/imagenes/${id}`, imagen); }
}
