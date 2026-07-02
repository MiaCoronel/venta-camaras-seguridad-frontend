import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Carrito } from '../models/carrito';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/carrito`;

  private _carrito = signal<Carrito | null>(null);
  carrito = this._carrito.asReadonly();

  total = computed(() => this._carrito()?.total ?? 0);
  cantidad = computed(() =>
    this._carrito()?.items.reduce((acc, item) => acc + item.cantidad, 0) ?? 0
  );
  items = computed(() => this._carrito()?.items ?? []);

  agregar(camaraId: number, cantidad: number): Observable<Carrito> {
    return this.http.post<Carrito>(
      `${this.apiUrl}/agregar?camaraId=${camaraId}&cantidad=${cantidad}`,
      {}
    );
  }

  obtenerCarrito(): Observable<Carrito> {
    return this.http.get<Carrito>(this.apiUrl);
  }

  eliminar(itemId: number): Observable<Carrito> {
    return this.http.delete<Carrito>(`${this.apiUrl}/item/${itemId}`);
  }

  actualizarCantidad(itemId: number, cantidad: number): Observable<Carrito> {
    return this.http.put<Carrito>(
      `${this.apiUrl}/item/${itemId}?cantidad=${cantidad}`,
      {}
    );
  }

  setCarrito(carrito: Carrito): void {
    this._carrito.set(carrito);
  }

  vaciar(): void {
    this._carrito.set(null);
  }
}