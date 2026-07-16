import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  error = '';

  loginForm = this.fb.nonNullable.group({

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

  login(): void {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();
      return;

    }


    this.authService.login(this.loginForm.getRawValue()).subscribe({

      next: (response) => {

        this.authService.bootstrapFromToken(response.token);

        Swal.fire({
          icon: 'success',
          title: '¡Login correcto!',
          text: 'Has iniciado sesión correctamente. Presiona aceptar para continuar.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#e94560',
          background: '#ffffff',
          timer: 3500,
          timerProgressBar: true,
          showClass: {
            popup: 'swal2-show',
          },
          hideClass: {
            popup: 'swal2-hide',
          }
        }).then(() => {
          this.router.navigate(['/']);
        });


      },

      error: (err) => {
        this.error = err.error?.message ?? 'No se pudo iniciar sesión.';
      }

    });

  }

}
