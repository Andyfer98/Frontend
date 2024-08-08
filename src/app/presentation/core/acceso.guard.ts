// Importación de módulos y clases necesarias
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';
import { ToastService } from '@UI/shared/service/toast.service';
import { TokenService } from '@UI/shared/service/token.service';

export const AccesoGuard = (roles: string[]): CanActivateFn => {
  return (route, state) => {
    const _router = inject(Router)
    const _toast = inject(ToastService)
    const _token = inject(TokenService)
    const token: UsuarioLogeadoModel = _token.getUsuario();

    if (token.id === 0) {
      _toast.error('Acceso denegado, no ha iniciado sesión.');
      _router.navigate(['']);
      return false;
    }

    if (roles.some(rol => token.rol?.toLowerCase() == rol.toLowerCase())) {
      return true
    } {
      console.log('Alla');

      _toast.error('Acceso denegado, no tiene permisos suficientes');
      _router.navigate(['']);
      return false;
    }
  }

}
