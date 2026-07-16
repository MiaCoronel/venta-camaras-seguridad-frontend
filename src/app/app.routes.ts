import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Camaras } from './pages/camaras/camaras';
import { DetalleCamara } from './pages/detalle-camara/detalle-camara';
import { LoginComponent } from './pages/login/login';
import { RegistroComponent } from './pages/registro/registro';
import { Carrito } from './pages/carrito/carrito';
import { Pagos } from './pages/pagos/pagos';
import { Resenas } from './pages/resenas/resenas';
import { Historial } from './pages/historial/historial';
import { Admin } from './pages/admin/admin';
import { Perfil } from './pages/perfil/perfil';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'camaras', component: Camaras },
  { path: 'camaras/:id', component: DetalleCamara },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'carrito', component: Carrito, canActivate: [authGuard] },
  { path: 'historial', component: Historial, canActivate: [authGuard] },
  { path: 'ordenes', redirectTo: 'historial', pathMatch: 'full' },
  { path: 'admin', component: Admin, canActivate: [adminGuard] },
  { path: 'perfil', component: Perfil, canActivate: [authGuard] },
  { path: 'pagos', component: Pagos, canActivate: [adminGuard] },
  { path: 'resenas', component: Resenas },
  { path: '**', redirectTo: '' }
];
