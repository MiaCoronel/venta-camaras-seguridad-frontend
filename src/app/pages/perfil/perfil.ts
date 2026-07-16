import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
})
export class Perfil implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private clienteService = inject(ClienteService);
  private notification = inject(NotificationService);

  loading = signal(false);
  error = signal('');
  exito = signal('');

  cliente = this.auth.cliente;

  clienteForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefono: [''],
    direccion: [''],
    dni: ['', Validators.pattern(/^$|^[0-9]{8}$/)],
    ruc: ['', Validators.pattern(/^$|^[0-9]{11}$/)],
  });

  ngOnInit(): void {
    const c = this.cliente();
    if (c) {
      this.clienteForm.patchValue({
        nombre: c.nombre,
        email: c.email,
        telefono: c.telefono ?? '',
        direccion: c.direccion ?? '',
        dni: c.dni ?? '',
        ruc: c.ruc ?? '',
      });
    } else {
      const user = this.auth.user();
      if (user?.username) {
        this.clienteForm.patchValue({ email: user.username });
      }
    }
  }

  guardar(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      return;
    }

    const data = this.clienteForm.getRawValue();
    const usuario = this.auth.user();
    if (!usuario) {
      this.error.set('Usuario no identificado');
      return;
    }

    this.loading.set(true);
    this.error.set('');

    const payload = {
      nombre: data.nombre,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion,
      dni: data.dni,
      ruc: data.ruc,
      userId: usuario.id,
    };

    this.clienteService.guardarMiPerfil(payload).subscribe({
      next: (c: Cliente) => {
        this.auth.setCliente(c);
        this.exito.set('');
        this.notification.exito('Perfil actualizado', 'Tus datos se guardaron correctamente.');
        this.loading.set(false);
      },
      error: (err) => {
        const mensaje = err.error?.message ?? 'No se pudieron guardar los datos del cliente';
        this.error.set(mensaje);
        this.notification.error('No se pudo guardar', mensaje);
        this.loading.set(false);
      }
    });
  }
}

