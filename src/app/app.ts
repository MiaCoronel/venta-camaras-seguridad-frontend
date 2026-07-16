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

      this.authService.bootstrapFromToken();

      this.authService.getCurrentUser().subscribe({

        error: () => this.authService.logout()

      });

    }

  }

}
