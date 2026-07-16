import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cliente } from '../models/cliente';

@Injectable({ providedIn: 'root' })
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/clientes`;

  obtenerTodos(): Observable<Cliente[]> {
	return this.http.get<Cliente[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<Cliente> {
	return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  obtenerPorEmail(email: string): Observable<Cliente> {
	return this.http.get<Cliente>(`${this.apiUrl}/email/${encodeURIComponent(email)}`);
  }

  obtenerPorUserId(userId: number): Observable<Cliente> {
	return this.http.get<Cliente>(`${this.apiUrl}/user/${userId}`);
  }

  obtenerMiPerfil(): Observable<Cliente> {
	return this.http.get<Cliente>(`${this.apiUrl}/me`);
  }

  guardarMiPerfil(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
	return this.http.put<Cliente>(`${this.apiUrl}/me`, cliente);
  }

  buscarPorNombre(nombre: string): Observable<Cliente[]> {
	return this.http.get<Cliente[]>(`${this.apiUrl}/buscar/nombre?nombre=${encodeURIComponent(nombre)}`);
  }

  buscarPorTelefono(telefono: string): Observable<Cliente> {
	return this.http.get<Cliente>(`${this.apiUrl}/buscar/telefono?telefono=${encodeURIComponent(telefono)}`);
  }

  crear(cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
	return this.http.post<Cliente>(this.apiUrl, cliente);
  }

  actualizar(id: number, cliente: Omit<Cliente, 'id'>): Observable<Cliente> {
	return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente);
  }

  eliminar(id: number): Observable<void> {
	return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
