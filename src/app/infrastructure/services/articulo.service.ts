import { catchError, Observable, of, throwError } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ResponseModel } from '@domain/base/response';

import { environment } from '@environment/environment';
import { AnuncioModel } from '@domain/models/anuncio.model';
import { ResponseApi } from '@domain/models/ResponseApi';
import { ArticuloModel } from '@domain/models/articulo.model';

@Injectable({
  providedIn: 'root'
})
export class ArticuloService {

  private apiUrl = "https://localhost:7233/api/Articulo"

  constructor(private http: HttpClient){}

  getById(id: number): Observable<ResponseModel<ArticuloModel>> {
    return this.http.get<ResponseModel<ArticuloModel>>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<ResponseModel<ArticuloModel[]>> {
    return this.http.get<ResponseModel<ArticuloModel[]>>(this.apiUrl);
  }

  add(articulo: ArticuloModel): Observable<ResponseModel<string>> {
    return this.http.post<ResponseModel<string>>(this.apiUrl, articulo);
  }

  // update(anuncio: AnuncioModel): Observable<ResponseModel<string>> {
  //   return this.http.put<ResponseModel<string>>(this.apiUrl, anuncio);
  // }
  
  update(articulo: ArticuloModel): Observable<string> {
    return this.http.put<string>(this.apiUrl, articulo, { responseType: 'text' as 'json' });
  }

  delete(id: number): Observable<ResponseModel<string>> {
    return this.http.delete<ResponseModel<string>>(`${this.apiUrl}/${id}`);
  }

}
