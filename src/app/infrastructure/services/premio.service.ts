import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResponseModel } from '@domain/base/response';
import { PremioModel } from '@domain/models/premio.model';

import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PremioService {

  private urlBase = environment.endpoint
  private endpoint: string = 'Premio/'

  constructor(private _http: HttpClient) { }

  agregar(premio: PremioModel): Observable<ResponseModel<string>> {
    return this._http.post<ResponseModel<string>>(`${this.urlBase}${this.endpoint}`, premio)
  }

  actualizar(premio: PremioModel): Observable<ResponseModel<string>> {
    return this._http.put<ResponseModel<string>>(`${this.urlBase}${this.endpoint}`, premio)
  }

  eliminar(id: number): Observable<ResponseModel<string>> {
    return this._http.delete<ResponseModel<string>>(`${this.urlBase}${this.endpoint}${id}`)
  }
  
  listar(): Observable<ResponseModel<PremioModel[]>> {
    return this._http.get<ResponseModel<PremioModel[]>>(`${this.urlBase}${this.endpoint}`)
  }

  listarPorPatrocinador(id: number): Observable<ResponseModel<PremioModel[]>> {
    return this._http.get<ResponseModel<PremioModel[]>>(`${this.urlBase}${this.endpoint}patrocinador/${id}`)
  }

}
