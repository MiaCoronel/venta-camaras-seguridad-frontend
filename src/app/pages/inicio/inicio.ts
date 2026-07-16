import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({selector:'app-inicio',imports:[RouterLink],templateUrl:'./inicio.html',styleUrl:'./inicio.css'})
export class Inicio {
  auth=inject(AuthService); private notification=inject(NotificationService);
  soluciones=[
    {numero:'01',titulo:'Interior',texto:'Supervisa habitaciones, oficinas y zonas comunes con equipos compactos.'},
    {numero:'02',titulo:'Exterior',texto:'Protección resistente para fachadas, patios, estacionamientos y accesos.'},
    {numero:'03',titulo:'PTZ y profesional',texto:'Mayor cobertura y control para negocios que no pueden perder ningún detalle.'}
  ];
  beneficios=[{valor:'24/7',texto:'Vigilancia continua'},{valor:'4K',texto:'Imagen de alta nitidez'},{valor:'IP66',texto:'Protección exterior'},{valor:'100%',texto:'Compra trazable'}];
  constructor(){const mensaje=localStorage.getItem('loginSuccessMessage');if(mensaje){localStorage.removeItem('loginSuccessMessage');setTimeout(()=>this.notification.exito('Sesión iniciada','Bienvenido de vuelta a CamShop.'),0)}}
}
