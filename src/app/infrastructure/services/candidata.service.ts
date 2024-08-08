import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResponseModel } from '@domain/base/response';
import { CandidataModel } from '@domain/models/candidata.model';

import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CandidataService {

  private urlBase = environment.endpoint
  private endpoint: string = 'Candidata/'

  constructor(private _http: HttpClient) { }

  agregar(candidata: CandidataModel): Observable<ResponseModel<string>> {
    return this._http.post<ResponseModel<string>>(`${this.urlBase}${this.endpoint}`, candidata)
  }

  actualizar(candidata: CandidataModel): Observable<ResponseModel<string>> {
    return this._http.put<ResponseModel<string>>(`${this.urlBase}${this.endpoint}`, candidata)
  }

  consultar(id: number): Observable<ResponseModel<CandidataModel>> {
    return this._http.get<ResponseModel<CandidataModel>>(`${this.urlBase}${this.endpoint}${id}`)
  }

  eliminar(id: number): Observable<ResponseModel<string>> {
    return this._http.delete<ResponseModel<string>>(`${this.urlBase}${this.endpoint}${id}`)
  }

  listar(): Observable<ResponseModel<CandidataModel[]>> {
    return this._http.get<ResponseModel<CandidataModel[]>>(`${this.urlBase}${this.endpoint}`)
  }

}
