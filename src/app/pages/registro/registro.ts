import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notification = inject(NotificationService);

  error = '';

  registerForm = this.fb.nonNullable.group({
    username: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ]
  });

  register(): void {

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.authService.register(this.registerForm.getRawValue()).subscribe({

      next: () => {

        // Si el backend devuelve un JWT al registrarse
        // puedes guardar el token en el AuthService
        // o simplemente redirigir al login.

        this.notification.exito('Cuenta creada', 'Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);

      },

      error: (err) => {

        console.error(err);

        this.error = err.error?.message ?? 'No se pudo registrar el usuario.';
        this.notification.error('No se pudo crear la cuenta', this.error);

      }

    });

  }

}
