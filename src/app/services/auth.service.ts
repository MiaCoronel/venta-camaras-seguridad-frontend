import { signal, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, switchMap, map } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '../models/usuario';
import {LoginRequest} from '../models/login-request';
import {AuthResponse} from '../models/auth-response';
import {RegisterRequest} from '../models/register-resquest';
import { Cliente } from '../models/cliente';
import { ClienteService } from './cliente.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);
  private clienteService = inject(ClienteService);

  private api = `${environment.apiUrl}/auth`;

  token = signal<string | null>(
    localStorage.getItem('token')
  );

  user = signal<User | null>(
    JSON.parse(localStorage.getItem('user') ?? 'null')
  );

  cliente = signal<Cliente | null>(
    JSON.parse(localStorage.getItem('cliente') ?? 'null')
  );

  private normalizarRoles(valor: unknown): string[] {
    if (!Array.isArray(valor)) {
      return [];
    }

    return valor
      .map((role) => {
        if (typeof role === 'string') {
          return role.trim();
        }

        if (typeof role === 'number' || typeof role === 'boolean') {
          return String(role).trim();
        }

        if (role && typeof role === 'object') {
          const posibleNombre = (role as { name?: unknown; role?: unknown; authority?: unknown }).name
            ?? (role as { name?: unknown; role?: unknown; authority?: unknown }).role
            ?? (role as { name?: unknown; role?: unknown; authority?: unknown }).authority;

          if (typeof posibleNombre === 'string') {
            return posibleNombre.trim();
          }
        }

        return '';
      })
      .filter((role) => role.length > 0);
  }

  private decodificarToken(token?: string | null): Record<string, unknown> | null {
    if (!token) {
      return null;
    }

    const partes = token.split('.');
    if (partes.length < 2) {
      return null;
    }

    try {
      const payload = partes[1].replace(/-/g, '+').replace(/_/g, '/');
      const base64 = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, '=');
      return JSON.parse(atob(base64));
    } catch {
      return null;
    }
  }

  private getTokenRoles(token?: string | null): string[] {
    const payload = this.decodificarToken(token ?? this.token());
    const roles = this.normalizarRoles(payload?.['roles']);

    if (roles.length) {
      return roles;
    }

    const role = payload?.['role'];
    if (typeof role === 'string') {
      return [role.trim()].filter(Boolean);
    }

    return this.normalizarRoles(role);
  }

  private getTokenUsername(token?: string | null): string | null {
    const payload = this.decodificarToken(token ?? this.token());
    const sub = payload?.['sub'];
    return typeof sub === 'string' ? sub : null;
  }

  private getTokenExp(token?: string | null): number | null {
    const payload = this.decodificarToken(token ?? this.token());
    const exp = payload?.['exp'];
    return typeof exp === 'number' ? exp : null;
  }

  private persistRoles(roles: string[]): void {
    const normalizados = this.normalizarRoles(roles);
    if (normalizados.length) {
      localStorage.setItem('roles', JSON.stringify(normalizados));
      localStorage.setItem('role', normalizados[0]);
      return;
    }

    localStorage.removeItem('roles');
    localStorage.removeItem('role');
  }

  bootstrapFromToken(token?: string | null): void {
    const roles = this.getTokenRoles(token);
    const username = this.getTokenUsername(token);

    if (roles.length) {
      this.persistRoles(roles);
    }

    this.user.update(current => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        username: username ?? current.username,
        roles: roles.length ? roles : current.roles,
        role: roles[0] ?? current.role
      };
    });

    if (!this.user() && username) {
      this.user.set({
        id: 0,
        username,
        roles: roles.length ? roles : undefined,
        role: roles[0]
      });
    }
  }

  private obtenerRoles(): string[] {
    const rolesUsuario = this.normalizarRoles(this.user()?.roles);

    if (rolesUsuario.length) {
      return rolesUsuario;
    }

    const rolesToken = this.getTokenRoles();
    if (rolesToken.length) {
      return rolesToken;
    }

    const storedRoles = localStorage.getItem('roles');
    if (storedRoles) {
      try {
        const parsed = JSON.parse(storedRoles);
        const normalizados = this.normalizarRoles(parsed);
        if (normalizados.length) {
          return normalizados;
        }
      } catch {
        // fallback below
      }
    }

    const role = this.user()?.role ?? localStorage.getItem('role');
    return role ? [role] : [];
  }

  login(request: LoginRequest) {

    return this.http.post<AuthResponse>(`${this.api}/login`, request).pipe(

      tap(response => {

        localStorage.setItem('token', response.token);
        localStorage.setItem('loginSuccessMessage', '¡Has iniciado sesión correctamente! Bienvenido de vuelta.');
        this.token.set(response.token);
        this.bootstrapFromToken(response.token);
        if (response.roles?.length) this.persistRoles(response.roles);
      }),
      switchMap(response => this.getCurrentUser().pipe(map(() => response)))

    );

  }

  register(request: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.api}/register`, {
      ...request,
      role: request.role ?? 'CLIENTE'
    });

  }

  getCurrentUser() {

    return this.http.get<User>(`${this.api}/me`).pipe(

      tap(user => {

        this.user.set(user);

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );

        const rolesNormalizados = this.normalizarRoles(user.roles);
        this.persistRoles(rolesNormalizados.length ? rolesNormalizados : this.getTokenRoles());

        if (rolesNormalizados.length && rolesNormalizados.length !== (user.roles?.length ?? 0)) {
          this.user.update(current => current ? { ...current, roles: rolesNormalizados, role: rolesNormalizados[0] } : current);
        }

        if (!user.username) {
          const username = this.getTokenUsername();
          if (username) {
            this.user.update(current => current ? { ...current, username } : current);
          }
        }

        this.cargarClienteDelUsuario(user.id);

      })

    );

  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cliente');
    localStorage.removeItem('role');
    localStorage.removeItem('roles');
    localStorage.removeItem('loginSuccessMessage');

    this.token.set(null);
    this.user.set(null);
    this.cliente.set(null);

  }

  isLogged() {

    const token = this.token();
    if (!token) {
      return false;
    }

    return !this.isTokenExpired();

  }

  isTokenExpired(): boolean {
    const exp = this.getTokenExp();

    if (!exp) {
      return false;
    }

    return Date.now() >= exp * 1000;
  }

  isAdmin(): boolean {
    return this.obtenerRoles().some(role => typeof role === 'string' && role.toUpperCase() === 'ADMIN');
  }


  getDisplayName(): string {
    if (this.isAdmin()) return 'Administrador';
    return this.cliente()?.nombre?.trim() || 'Usuario';
  }

  tieneCliente(): boolean {
    return this.cliente() != null;
  }

  setCliente(cliente: Cliente | null): void {
    this.cliente.set(cliente);

    if (cliente) {
      localStorage.setItem('cliente', JSON.stringify(cliente));
    } else {
      localStorage.removeItem('cliente');
    }
  }

  private cargarClienteDelUsuario(userId: number): void {
    if (!userId) {
      this.setCliente(null);
      return;
    }

    this.clienteService.obtenerMiPerfil().subscribe({
      next: (cliente) => this.setCliente(cliente),
      error: () => this.setCliente(null)
    });
  }

}
