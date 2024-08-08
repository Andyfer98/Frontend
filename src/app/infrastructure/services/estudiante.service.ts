import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ResponseModel } from '@domain/base/response';
import { EstudianteModel } from '@domain/models/estudiante.model';

import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {

  private urlBase = environment.endpoint
  private endpoint: string = 'Estudiante/'

  constructor(private _http: HttpClient) { }

  agregar(estudiante: EstudianteModel): Observable<ResponseModel<string>> {
    return this._http.post<ResponseModel<string>>(`${this.urlBase}${this.endpoint}`, estudiante)
  }

  actualizar(estudiante: EstudianteModel): Observable<ResponseModel<string>> {
    return this._http.put<ResponseModel<string>>(`${this.urlBase}${this.endpoint}`, estudiante)
  }

  consultar(id: number): Observable<ResponseModel<EstudianteModel>> {
    return this._http.get<ResponseModel<EstudianteModel>>(`${this.urlBase}${this.endpoint}${id}`)
  }

  eliminar(id: number): Observable<ResponseModel<string>> {
    return this._http.delete<ResponseModel<string>>(`${this.urlBase}${this.endpoint}${id}`)
  }

}
