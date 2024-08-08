import { ResponseModel } from './../../domain/base/response';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { VotoModel } from '@domain/models/voto.model';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VotoService {

  private urlBase = environment.endpoint
  private endpoint: string = 'Voto/'

  constructor(private _http: HttpClient) { }

  agregar(voto: VotoModel): Observable<ResponseModel<string>> {
    return this._http.post<ResponseModel<string>>(`${this.urlBase}${this.endpoint}`, voto)
  }

  eliminar(id: number): Observable<ResponseModel<string>> {
    return this._http.delete<ResponseModel<string>>(`${this.urlBase}${this.endpoint}${id}`)
  }

  consultarByIdEstudiante(id: number): Observable<ResponseModel<VotoModel>> {
    return this._http.get<ResponseModel<VotoModel>>(`${this.urlBase}${this.endpoint}estudiante/${id}`)
  }

  consultarByIdCandidata(id: number): Observable<ResponseModel<VotoModel[]>> {
    return this._http.get<ResponseModel<VotoModel[]>>(`${this.urlBase}${this.endpoint}candidata/${id}`)
  }

}
