import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { VotoModel } from '@domain/models/voto.model';
import { ResponseModel } from '@domain/base/response';

import { VotoService } from '@infrastructure/services/voto.service';

import { TokenService } from '@UI/shared/service/token.service';

@Component({
  selector: 'app-candidata-votos',
  standalone: true,
  imports: [],
  templateUrl: './candidata-votos.component.html',
  styleUrl: './candidata-votos.component.css'
})
export class CandidataVotosComponent implements OnInit, OnDestroy {
  
  public voto!: ResponseModel<VotoModel[]>

  private destroy$ = new Subject<void>()
  private responseVoto$!: Observable<ResponseModel<VotoModel[]>>

  constructor(
    private _token: TokenService,
    private _votoService: VotoService
  ){}

  ngOnInit(): void {
    this.loadVoto()
  }

  private loadVoto(){
    const usuarioLogeado = this._token.getUsuario()
    this.responseVoto$ = this._votoService.consultarByIdCandidata(usuarioLogeado.id!)
    this.responseVoto$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.voto = data
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}