import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/footer';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  private authService = inject(AuthService);

  constructor() {

    if (this.authService.isLogged()) {

      this.authService.getCurrentUser().subscribe({

        error: () => {

          // Si el token expiró o es inválido,
          // cerrar sesión automáticamente.
          this.authService.logout();

        }

      });

    }

  }

}
