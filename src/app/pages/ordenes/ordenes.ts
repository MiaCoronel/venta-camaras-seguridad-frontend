import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { OrdenService } from '../../services/orden.service';
import { Orden } from '../../models/orden';

@Component({
  selector: 'app-ordenes',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ordenes.html',
  styleUrl: './ordenes.css'
})
export class Ordenes {

  private fb = inject(FormBuilder);
  private ordenService = inject(OrdenService);

  loading = signal(false);
  error = signal('');
  exito = signal('');

  orden = signal<Orden | null>(null);

  formulario = this.fb.group({
    metodo: ['', Validators.required]
  });

  realizarCheckout() {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');
    this.exito.set('');

    const metodo = this.formulario.value.metodo!;

    this.ordenService.checkout(metodo).subscribe({
      next: (orden) => {

        this.orden.set(orden);

        this.exito.set(
          'Compra realizada correctamente'
        );

        this.loading.set(false);
      },

      error: (err) => {

        this.error.set(
          err.error || 'Error al realizar checkout'
        );

        this.loading.set(false);
      }
    });
  }
}