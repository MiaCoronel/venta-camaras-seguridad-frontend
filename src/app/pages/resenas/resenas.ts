import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ResenaService } from '../../services/resena.service';
import { CamaraService } from '../../services/camara.service';
import { AuthService } from '../../services/auth.service';
import { ListaResenas } from '../../components/lista-resenas/lista-resenas';
import { Resena } from '../../models/resena';
import { Camara } from '../../models/camara';
import { NotificationService } from '../../services/notification.service';

// Validador personalizado: rechaza comentarios vacíos o compuestos solo de espacios
function comentarioValidoValidator(control: AbstractControl): ValidationErrors | null {
  const valor = (control.value ?? '').trim();
  return valor.length === 0 ? { comentarioVacio: true } : null;
}

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ListaResenas],
  templateUrl: './resenas.html',
  styleUrl: './resenas.css',
})
export class Resenas implements OnInit {
  private resenaService = inject(ResenaService);
  private camaraService = inject(CamaraService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private notification = inject(NotificationService);

  // --- ESTÁNDAR DE COMPONENTES OBLIGATORIO ---
  loading = signal(false);
  error = signal('');

  mensajeExito = signal('');
  cargandoCamaras = signal(false);

  camaras = signal<Camara[]>([]);
  resenas = signal<Resena[]>([]);
  promedio = signal<number | null>(null);
  camaraSeleccionadaId = signal<number | null>(null);

  resenaForm = this.fb.nonNullable.group({
    calificacion: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comentario: ['', [Validators.required, Validators.minLength(5), comentarioValidoValidator]],
  });

  ngOnInit(): void {
    this.cargarCamaras();

    const camaraIdParam = Number(this.route.snapshot.queryParamMap.get('camaraId'));
    if (camaraIdParam) {
      this.seleccionarCamara(camaraIdParam);
    }
  }

  estaLogueado(): boolean {
    return this.authService.isLogged();
  }

  tieneCliente(): boolean {
    return this.authService.tieneCliente?.() ?? false;
  }

  cargarCamaras(): void {
    this.cargandoCamaras.set(true);

    this.camaraService.obtenerTodos().subscribe({
      next: (data: Camara[]) => {
        this.camaras.set(data);
        this.cargandoCamaras.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al cargar cámaras:', err.message);
        this.error.set('No se pudo cargar el catálogo de cámaras.');
        this.cargandoCamaras.set(false);
      },
    });
  }

  onCamaraChange(event: Event): void {
    const id = Number((event.target as HTMLSelectElement).value);
    this.seleccionarCamara(id);
  }

  seleccionarCamara(id: number): void {
    this.error.set('');
    this.mensajeExito.set('');

    if (!id) {
      this.camaraSeleccionadaId.set(null);
      this.resenas.set([]);
      this.promedio.set(null);
      return;
    }

    this.camaraSeleccionadaId.set(id);
    this.cargarResenas(id);
    this.cargarPromedio(id);
  }

  cargarResenas(camaraId: number): void {
    this.loading.set(true);
    this.error.set('');

    this.resenaService.obtenerTodos(camaraId).subscribe({
      next: (data: Resena[]) => {
        this.resenas.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error(`Error al cargar reseñas de la cámara ${camaraId}:`, err.message);
        this.error.set('No se pudieron cargar las reseñas.');
        this.loading.set(false);
      },
    });
  }

  cargarPromedio(camaraId: number): void {
    this.resenaService.obtenerPromedio(camaraId).subscribe({
      next: (data) => this.promedio.set(data),
      error: () => this.promedio.set(null),
    });
  }

  registrarResena(): void {
    const camaraId = this.camaraSeleccionadaId();

    if (!camaraId) {
      this.error.set('Selecciona una cámara antes de dejar tu reseña.');
      this.notification.info('Selecciona una cámara');
      return;
    }

    if (!this.estaLogueado()) {
      this.error.set('Debes iniciar sesión para dejar una reseña.');
      this.notification.info('Inicia sesión', 'Necesitas una cuenta para publicar una reseña.');
      return;
    }

    if (this.resenaForm.invalid) {
      this.resenaForm.markAllAsTouched();
      return;
    }

    const { calificacion, comentario } = this.resenaForm.getRawValue();

    this.loading.set(true);
    this.error.set('');
    this.mensajeExito.set('');

    this.resenaService.crear(camaraId, { calificacion, comentario }).subscribe({
      next: (nuevaResena: Resena) => {
        this.resenas.update((lista) => [nuevaResena, ...lista]);
        this.cargarPromedio(camaraId);
        this.mensajeExito.set('');
        this.notification.exito('¡Gracias por tu reseña!', 'Tu opinión ya está publicada.');
        this.resenaForm.reset({ calificacion: 5, comentario: '' });
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error al registrar reseña:', err.message);
        this.error.set(
          err.status === 500
            ? 'No se pudo registrar tu reseña. Es posible que ya hayas opinado sobre esta cámara.'
            : 'No se pudo registrar tu reseña. Intenta nuevamente.'
        );
        this.notification.error('No se pudo registrar la reseña', this.error());
        this.loading.set(false);
      },
    });
  }

  get comentarioInvalido(): boolean {
    const control = this.resenaForm.get('comentario');
    return !!control && control.invalid && control.touched;
  }
}
