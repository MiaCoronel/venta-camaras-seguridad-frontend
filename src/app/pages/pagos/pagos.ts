import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { PagoService } from '../../services/pago.service';
import { Pago } from '../../models/pago';

@Component({
  selector: 'app-pagos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css'
})
export class Pagos {

  private fb = inject(FormBuilder);
  private pagoService = inject(PagoService);

  loading = signal(false);
  error = signal('');

  pagos = signal<Pago[]>([]);

  formulario = this.fb.group({
    estado: ['APROBADO', Validators.required],
    montoMinimo: [0, [Validators.required, Validators.min(0)]]
  });

  buscar() {

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const estado = this.formulario.value.estado!;
    const monto = this.formulario.value.montoMinimo!;

    this.pagoService
      .buscarPorEstadoYMonto(estado, monto)
      .subscribe({

        next: (data) => {

          this.pagos.set(data);

          this.loading.set(false);
        },

        error: () => {

          this.error.set(
            'No se pudieron obtener los pagos'
          );

          this.loading.set(false);
        }
      });
  }

  ngOnInit() {
    this.buscar();
  }
}