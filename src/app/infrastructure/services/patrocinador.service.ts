import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResponseModel } from '@domain/base/response';
import { PatrocinadorModel } from '@domain/models/patrocinador.model';

import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class PatrocinadorService {

  private urlBase = environment.endpoint
  private endpoint: string = 'Patrocinador/'

  constructor(private _http: HttpClient) { }

  agregar(patrocinador: PatrocinadorModel): Observable<ResponseModel<string>> {
    return this._http.post<ResponseModel<string>>(`${this.urlBase}${this.endpoint}`, patrocinador)
  }

  actualizar(patrocinador: PatrocinadorModel): Observable<ResponseModel<string>> {
    return this._http.put<ResponseModel<string>>(`${this.urlBase}${this.endpoint}`, patrocinador)
  }

  consultar(id: number): Observable<ResponseModel<PatrocinadorModel>> {
    return this._http.get<ResponseModel<PatrocinadorModel>>(`${this.urlBase}${this.endpoint}${id}`)
  }

  eliminar(id: number): Observable<ResponseModel<string>> {
    return this._http.delete<ResponseModel<string>>(`${this.urlBase}${this.endpoint}${id}`)
  }

  listar(): Observable<ResponseModel<PatrocinadorModel[]>> {
    return this._http.get<ResponseModel<PatrocinadorModel[]>>(`${this.urlBase}${this.endpoint}`)
  }

}
