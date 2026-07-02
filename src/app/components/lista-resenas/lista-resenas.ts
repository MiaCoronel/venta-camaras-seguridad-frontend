import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Resena } from '../../models/resena';

@Component({
  selector: 'app-lista-resenas',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './lista-resenas.html',
  styleUrl: './lista-resenas.css',
})
export class ListaResenas {
  // Input basado en Signals (requerido)
  resenas = input.required<Resena[]>();
}
