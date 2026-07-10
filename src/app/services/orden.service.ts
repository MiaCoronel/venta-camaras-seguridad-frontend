import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Orden } from '../models/orden';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  private http = inject(HttpClient);
<<<<<<< HEAD

  private apiUrl = `${environment.apiUrl}/ordenes`;
=======
  private apiUrl = `${environment.apiUrl}/api/ordendetalle-camara actualizado)es`;
>>>>>>> 04a6cd4 (feat: carrito completo con backend, item-carrito component, 

  checkout(metodo: string): Observable<Orden> {

    return this.http.post<Orden>(
      `${this.apiUrl}/checkout?metodo=${metodo}`,
      {}
    );

  }
}