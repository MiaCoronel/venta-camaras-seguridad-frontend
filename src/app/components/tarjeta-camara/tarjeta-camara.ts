import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
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
}