import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private mostrar(icon: SweetAlertIcon, title: string, text?: string): void {
    void Swal.fire({
      toast: true,
      position: 'top-end',
      icon,
      title,
      text,
      showConfirmButton: false,
      timer: 3200,
      timerProgressBar: true,
      customClass: { popup: 'camshop-toast' }
    });
  }

  exito(title: string, text?: string): void { this.mostrar('success', title, text); }
  error(title: string, text?: string): void { this.mostrar('error', title, text); }
  info(title: string, text?: string): void { this.mostrar('info', title, text); }
}
