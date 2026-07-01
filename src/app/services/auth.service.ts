import { signal, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

import { environment } from '../../environments/environment';
import { User } from '../models/usuario';
import {LoginRequest} from '../models/login-request';
import {AuthResponse} from '../models/auth-response';
import {RegisterRequest} from '../models/register-resquest';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/auth`;

  token = signal<string | null>(
    localStorage.getItem('token')
  );

  user = signal<User | null>(
    JSON.parse(localStorage.getItem('user') ?? 'null')
  );

  login(request: LoginRequest) {

    return this.http.post<AuthResponse>(`${this.api}/login`, request).pipe(

      tap(response => {

        localStorage.setItem('token', response.token);

        this.token.set(response.token);

      })

    );

  }

  register(request: RegisterRequest) {

    return this.http.post<AuthResponse>(`${this.api}/register`, request);

  }

  getCurrentUser() {

    return this.http.get<User>(`${this.api}/me`).pipe(

      tap(user => {

        this.user.set(user);

        localStorage.setItem(
          'user',
          JSON.stringify(user)
        );

      })

    );

  }

  logout() {

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.token.set(null);
    this.user.set(null);

  }

  isLogged() {

    return this.token() != null;

  }

}
