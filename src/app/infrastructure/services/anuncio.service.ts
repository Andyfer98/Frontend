import { catchError, Observable, of, throwError } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import { ResponseModel } from '@domain/base/response';

import { environment } from '@environment/environment';
import { AnuncioModel } from '@domain/models/anuncio.model';
import { ResponseApi } from '@domain/models/ResponseApi';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {

  private apiUrl = "https://localhost:7233/api/Anuncio"

  constructor(private http: HttpClient){}

  getById(id: number): Observable<ResponseModel<AnuncioModel>> {
    return this.http.get<ResponseModel<AnuncioModel>>(`${this.apiUrl}/${id}`);
  }

  getAll(): Observable<ResponseModel<AnuncioModel[]>> {
    return this.http.get<ResponseModel<AnuncioModel[]>>(this.apiUrl);
  }

  add(anuncio: AnuncioModel): Observable<ResponseModel<string>> {
    return this.http.post<ResponseModel<string>>(this.apiUrl, anuncio);
  }

  // update(anuncio: AnuncioModel): Observable<ResponseModel<string>> {
  //   return this.http.put<ResponseModel<string>>(this.apiUrl, anuncio);
  // }
  
  update(anuncio: AnuncioModel): Observable<string> {
    return this.http.put<string>(this.apiUrl, anuncio, { responseType: 'text' as 'json' });
  }

  delete(id: number): Observable<ResponseModel<string>> {
    return this.http.delete<ResponseModel<string>>(`${this.apiUrl}/${id}`);
  }

}
