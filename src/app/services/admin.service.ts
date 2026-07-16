import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/usuario';
import { Camara } from '../models/camara';
import { DashboardResumen } from '../models/dashboard';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/admin`;

  listarUsuarios(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/usuarios`);
  }

  listarCamaras(): Observable<Camara[]> {
    return this.http.get<Camara[]>(`${this.apiUrl}/camaras`);
  }

  obtenerDashboard(): Observable<DashboardResumen> {
    return this.http.get<DashboardResumen>(`${this.apiUrl}/reportes/resumen`);
  }

  cambiarEstado(id: number, enabled: boolean): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/usuarios/${id}/estado?enabled=${enabled}`, {});
  }

  cambiarRol(id: number, rol: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/usuarios/${id}/rol?rol=${encodeURIComponent(rol)}`, {});
  }
}
