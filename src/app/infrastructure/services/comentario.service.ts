import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseModel } from '@domain/base/response';
import { ComentarioModel } from '@domain/models/comentario.model';
import { environment } from '@environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  private urlBase = environment.endpoint
  private endpoint: string = 'Comentario/'

  constructor(private _http: HttpClient) { }

  agregar(comentario: ComentarioModel): Observable<ResponseModel<string>> {
    return this._http.post<ResponseModel<string>>(`${this.urlBase}${this.endpoint}`, comentario)
  }

  eliminar(id: number): Observable<ResponseModel<string>> {
    return this._http.delete<ResponseModel<string>>(`${this.urlBase}${this.endpoint}${id}`)
  }
  
  consultarByIdEstudiante(id: number): Observable<ResponseModel<ComentarioModel[]>> {
    return this._http.get<ResponseModel<ComentarioModel[]>>(`${this.urlBase}${this.endpoint}estudiante/${id}`)
  }

  consultarByIdCandidata(id: number): Observable<ResponseModel<ComentarioModel[]>> {
    return this._http.get<ResponseModel<ComentarioModel[]>>(`${this.urlBase}${this.endpoint}candidata/${id}`)
  }

}
