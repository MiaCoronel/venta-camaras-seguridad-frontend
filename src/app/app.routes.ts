import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Camaras } from './pages/camaras/camaras';
import { DetalleCamara } from './pages/detalle-camara/detalle-camara';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Carrito } from './pages/carrito/carrito';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'cameras', component: Camaras },
  { path: 'cameras/:id', component: DetalleCamara },
  { path: 'login', component: Login },
  { path: 'register', component: Registro },
  { path: 'cart', component: Carrito },
  { path: '**', redirectTo: '' }
];
