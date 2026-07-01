import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Camaras } from './pages/camaras/camaras';
import { DetalleCamara } from './pages/detalle-camara/detalle-camara';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { Carrito } from './pages/carrito/carrito';
import { Ordenes } from './pages/ordenes/ordenes';
import { Pagos } from './pages/pagos/pagos';
import { Resenas } from './pages/resenas/resenas';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'camaras', component: Camaras },
  { path: 'camaras/:id', component: DetalleCamara },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'carrito', component: Carrito, canActivate: [authGuard] },
  { path: 'ordenes', component: Ordenes, canActivate: [authGuard] },
  { path: 'pagos', component: Pagos, canActivate: [authGuard] },
  { path: 'resenas', component: Resenas },
  { path: '**', redirectTo: '' }
];
