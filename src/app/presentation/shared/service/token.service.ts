import { jwtDecode } from 'jwt-decode';
import { Injectable } from '@angular/core';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private _token: string = 'token-reina-facultad'

  create(token: string): void {
    localStorage.setItem(this._token, token);
  }

  clear(): void {
    localStorage.removeItem(this._token);
  }

  get(): string | null {
    return localStorage.getItem(this._token);
  }

  getUsuario(): UsuarioLogeadoModel {
    const token = this.get();
    if (!token) {
      return { id: 0, rol: 'desconocido', nombres: 'Usuario desconocido' };
    }
  
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      return {
        id: Number(decodedToken.nameid),
        rol: decodedToken.unique_name[0],
        nombres: decodedToken.unique_name[1]
      };
    } catch (error) {
      return { id: 0, rol: 'desconocido', nombres: 'Usuario desconocido' };
    }
  }
  
}

interface DecodedToken {
  nameid: string
  unique_name: [string, string]
}