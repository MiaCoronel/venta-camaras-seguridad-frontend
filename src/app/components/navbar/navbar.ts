import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  auth = inject(AuthService);
  private router = inject(Router);
  menuAbierto = signal(false);

  alternarMenu(): void { this.menuAbierto.update(valor => !valor); }
  cerrarMenu(): void { this.menuAbierto.set(false); }

  logout(): void {

    this.auth.logout();

    this.router.navigate(['/login']);
    this.cerrarMenu();

  }

}
