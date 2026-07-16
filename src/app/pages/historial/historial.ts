import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { timer } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrdenService } from '../../services/orden.service';
import { Orden } from '../../models/orden';
import { environment } from '../../../environments/environment';

@Component({ selector:'app-historial', standalone:true, imports:[CommonModule,RouterLink], templateUrl:'./historial.html', styleUrl:'./historial.css' })
export class Historial implements OnInit {
  private ordenService=inject(OrdenService); private destroyRef=inject(DestroyRef);
  loading=signal(false); error=signal(''); historial=signal<Orden[]>([]);
  readonly estados=[
    {codigo:'PENDIENTE',titulo:'Pendiente',descripcion:'La orden fue recibida y está pendiente de validar el pago.'},
    {codigo:'PAGADO',titulo:'Pagado',descripcion:'El pago simulado fue aprobado y la orden está confirmada.'},
    {codigo:'PROCESANDO',titulo:'Procesando',descripcion:'El proveedor está preparando los productos de tu pedido.'},
    {codigo:'ENVIADO',titulo:'Enviado',descripcion:'Tu pedido salió del proveedor y se encuentra en camino.'},
    {codigo:'ENTREGADO',titulo:'Entregado',descripcion:'El pedido fue entregado y la compra quedó finalizada.'}
  ];

  ngOnInit():void {
    this.cargarHistorial();
    timer(20000,20000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(()=>this.cargarHistorial(false));
  }
  cargarHistorial(mostrarCarga=true):void {
    if(mostrarCarga)this.loading.set(true); this.error.set('');
    this.ordenService.listarMias().subscribe({
      next:ordenes=>{this.historial.set(ordenes);this.loading.set(false)},
      error:err=>{if(mostrarCarga)this.error.set(err.error?.message??'No se pudo cargar el historial.');this.loading.set(false)}
    });
  }
  estadoIndice(estado:string):number { const i=this.estados.findIndex(e=>e.codigo===estado?.toUpperCase()); return Math.max(0,i); }
  progreso(estado:string):number { return this.estadoIndice(estado)*25; }
  estaAlcanzado(estado:string,indice:number):boolean { return indice<=this.estadoIndice(estado); }
  esActual(estado:string,codigo:string):boolean { return estado?.toUpperCase()===codigo; }
  estaCancelada(estado:string):boolean { return estado?.toUpperCase()==='CANCELADO'; }
  whatsappUrl(orden:Orden):string { const mensaje=encodeURIComponent(`Hola, quisiera consultar el estado de mi pedido #${orden.id}.`);return `https://wa.me/${environment.whatsappNumber}?text=${mensaje}`; }
}
