import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Carrito } from '../models/carrito';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CarritoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/carrito`;

  private _carrito = signal<Carrito | null>(null);
  carrito = this._carrito.asReadonly();

  total = computed(() => this._carrito()?.total ?? 0);
  cantidad = computed(() =>
    this._carrito()?.items.reduce((acc, item) => acc + item.cantidad, 0) ?? 0
  );
  items = computed(() => this._carrito()?.items ?? []);

  agregar(camaraId: number, cantidad: number): Observable<Carrito> {
    // HttpParams requiere valores tipo string
    const params = new HttpParams()
      .set('camaraId', String(camaraId))
      .set('cantidad', String(cantidad));

    return this.http.post<Carrito>(`${this.apiUrl}/agregar`, {}, { params });
  }

  obtenerCarrito(): Observable<Carrito> {
    return this.http.get<Carrito>(this.apiUrl);
  }

  eliminar(itemId: number): Observable<Carrito> {
    return this.http.delete<Carrito>(`${this.apiUrl}/item/${itemId}`);
  }

  incrementarItem(itemId: number): Observable<Carrito> {
    return this.http.post<Carrito>(`${this.apiUrl}/item/${itemId}/incrementar`, {});
  }

  decrementarItem(itemId: number): Observable<Carrito> {
    return this.http.post<Carrito>(`${this.apiUrl}/item/${itemId}/decrementar`, {});
  }

  actualizarCantidad(itemId: number, cantidad: number): Observable<Carrito> {
    const item = this._carrito()?.items.find((i) => i.id === itemId);

    if (!item) {
      return this.incrementarItem(itemId);
    }

    if (cantidad > item.cantidad) {
      return this.incrementarItem(itemId);
    }

    if (cantidad < item.cantidad) {
      return this.decrementarItem(itemId);
    }

    return of(this._carrito() as Carrito);
  }

  vaciarCarrito(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/vaciar`);
  }

  setCarrito(carrito: Carrito): void {
    this._carrito.set(carrito);
  }

  vaciar(): void {
    this._carrito.set(null);
  }
}
