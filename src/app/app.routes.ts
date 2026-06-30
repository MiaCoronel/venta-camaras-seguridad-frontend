import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { CamerasComponent } from './pages/cameras/cameras';
import { CameraDetailComponent } from './pages/camera-detail/camera-detail';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { CartComponent } from './pages/cart/cart';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cameras', component: CamerasComponent },
  { path: 'cameras/:id', component: CameraDetailComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '' }
];