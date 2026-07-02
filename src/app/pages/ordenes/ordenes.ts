import { Component, OnInit, inject, signal } from '@angular/core';
import { OrdenService } from '../../services/orden.service';
import { Orden } from '../../models/orden';

@Component({
  selector: 'app-ordenes',
  standalone: true,
  templateUrl: './ordenes.html',
  styleUrls: ['./ordenes.css']
})
export class OrdenesComponent implements OnInit {

  private ordenService = inject(OrdenService);

  ordenes = signal<Orden[]>([]);

  loading = signal(false);

  error = signal('');

  ngOnInit(): void {
    this.cargarOrdenes();
  }

  cargarOrdenes() {

    this.loading.set(true);

    this.ordenService.obtenerTodos().subscribe({

      next: (data) => {
        this.ordenes.set(data);
        this.loading.set(false);
      },

      error: () => {
        this.error.set('No fue posible cargar las órdenes.');
        this.loading.set(false);
      }

    });

  }

}
