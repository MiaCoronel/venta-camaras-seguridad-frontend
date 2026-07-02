import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { PagoService } from '../../services/pago.service';
import { Pago } from '../../models/pago';

@Component({
  selector: 'app-pagos',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './pagos.html',
  styleUrl: './pagos.css'
})
export class Pagos {
  private pagoService = inject(PagoService);
  private fb = inject(FormBuilder);

  loading = signal(false);
  error = signal('');
  exito = signal('');

  formulario = this.fb.group({
    ordenId: [null, [Validators.required, Validators.min(1)]],
    metodo: ['', [Validators.required]],
    monto: [null, [Validators.required, Validators.min(0.01)]],
    observacion: ['']
  });

  registrarPago(): void {
    this.error.set('');
    this.exito.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const pago = this.formulario.getRawValue() as Pago;

    this.pagoService.crear(pago).subscribe({
      next: () => {
        this.exito.set('✅ Pago registrado correctamente.');
        this.formulario.reset();
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al registrar pago:', err.message);
        this.error.set('No se pudo registrar el pago.');
        this.loading.set(false);
      }
    });
  }
}