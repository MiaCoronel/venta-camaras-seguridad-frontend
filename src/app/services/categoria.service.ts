import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categoria } from '../models/categoria';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/api/categorias`;
  listar(): Observable<Categoria[]> { return this.http.get<Categoria[]>(this.api); }
  crear(data: Omit<Categoria, 'id'>): Observable<Categoria> { return this.http.post<Categoria>(this.api, data); }
  actualizar(id: number, data: Omit<Categoria, 'id'>): Observable<Categoria> { return this.http.put<Categoria>(`${this.api}/${id}`, data); }
  cambiarEstado(id: number, activo: boolean): Observable<Categoria> { return this.http.patch<Categoria>(`${this.api}/${id}/estado?activo=${activo}`, {}); }
}
