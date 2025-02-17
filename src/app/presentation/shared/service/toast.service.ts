import { Injectable } from '@angular/core';
import { Notyf } from 'notyf';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  notyf = new Notyf();

  private showToast(message: string, options: { icon: string, background: string }) {
    const config = {
      duration: 5000,
      dismissible: true,
      ...options,
    };

    this.notyf.open({
      message,
      ...config,
    });
  }

  error(mensaje: string) {
    const options = {
      icon: '<i class="bi bi-exclamation-triangle-fill"></i>',
      background: '#DD4441',
    };
    this.showToast(mensaje, options);
  }

  success(mensaje: string) {
    const options = {
      icon: '<i class="bi bi-check-circle-fill"></i>',
      background: '#009929',
    };
    this.showToast(mensaje, options);
  }

}
