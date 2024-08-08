import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ResponseModel } from '@domain/base/response';

import { environment } from '@environment/environment';
import { AuthenticationModel } from '@domain/models/authentication.model';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private urlBase = environment.endpoint

  constructor(private _http: HttpClient) { }

  login(credenciales: AuthenticationModel, url: string): Observable<ResponseModel<string>> {
    return this._http.post<ResponseModel<string>>(`${this.urlBase}${url}/login`, credenciales)
  }

}
