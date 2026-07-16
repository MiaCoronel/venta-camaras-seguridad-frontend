import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { CamaraService } from '../../services/camara.service';
import { CategoriaService } from '../../services/categoria.service';
import { TarjetaCamara } from '../../components/tarjeta-camara/tarjeta-camara';
import { Camara } from '../../models/camara';
import { Categoria } from '../../models/categoria';

@Component({ selector:'app-camaras', standalone:true, imports:[TarjetaCamara, ReactiveFormsModule], templateUrl:'./camaras.html', styleUrl:'./camaras.css' })
export class Camaras implements OnInit {
  private camaraService=inject(CamaraService); private categoriaService=inject(CategoriaService); private fb=inject(FormBuilder);
  loading=signal(false); error=signal(''); camaras=signal<Camara[]>([]); categorias=signal<Categoria[]>([]);
  filtros=this.fb.nonNullable.group({ marca:[''], categoriaId:[null as number|null], precioMin:[null as number|null], precioMax:[null as number|null], soloStock:[false] });
  ngOnInit():void { this.cargarCatalogo(); this.categoriaService.listar().subscribe({next:data=>this.categorias.set(data.filter(c=>c.activo!==false))}); }
  cargarCatalogo():void {
    this.loading.set(true); this.error.set('');
    this.camaraService.obtenerTodos(this.filtros.getRawValue()).subscribe({
      next:data=>{this.camaras.set(data);this.loading.set(false)},
      error:(err:HttpErrorResponse)=>{this.error.set(err.error?.message??'No se pudo cargar el catálogo.');this.loading.set(false)}
    });
  }
  limpiar():void { this.filtros.reset({marca:'',categoriaId:null,precioMin:null,precioMax:null,soloStock:false}); this.cargarCatalogo(); }
}
