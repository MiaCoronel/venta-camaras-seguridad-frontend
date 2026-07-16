import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CamaraImagen } from '../../models/camara-imagen';
import { Camara } from '../../models/camara';

@Component({
  selector: 'app-tarjeta-camara',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './tarjeta-camara.html',
  styleUrl: './tarjeta-camara.css',
})
export class TarjetaCamara {
  // Input basado en Signals (requerido para que no sea null)
  camara = input.required<Camara>();

  imagenPrincipal(): CamaraImagen | null {
    const imagenes = this.camara().imagenes ?? [];
    return imagenes.find((imagen) => imagen.esPrincipal) ?? imagenes[0] ?? null;
  }

  descripcionCorta(): string {
    const camara = this.camara();
    return camara.descripcion?.trim()
      || `${camara.marca} ${camara.modelo} con resolución ${camara.resolucion}, ideal para vigilancia confiable.`;
  }

  etiquetaStock(): string {
    const stock = this.camara().stock;
    if (stock <= 0) return 'Agotada';
    if (stock <= 3) return `Últimas ${stock} unidades`;
    return `${stock} disponibles`;
  }
}
