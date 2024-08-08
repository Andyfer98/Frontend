import { RouterLink } from '@angular/router';
import { forkJoin, Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { ToastService } from '@UI/shared/service/toast.service';
import { TokenService } from '@UI/shared/service/token.service';

import { ResponseModel } from '@domain/base/response';
import { PremioModel } from '@domain/models/premio.model';
import { CandidataModel } from '@domain/models/candidata.model';
import { PatrocinadorModel } from '@domain/models/patrocinador.model';

import { PremioService } from '@infrastructure/services/premio.service';
import { CandidataService } from '@infrastructure/services/candidata.service';
import { PatrocinadorService } from '@infrastructure/services/patrocinador.service';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';
import { MatDialog } from '@angular/material/dialog';
import { ModalComentarioComponent } from '../modal-comentario/modal-comentario.component';
import { ModalVotacionComponent } from '../modal-votacion/modal-votacion.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatProgressBarModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  public loading = signal<boolean>(false)
  public usuarioLogeado!: UsuarioLogeadoModel
  
  public premios: PremioModel[] = []
  public candidatas: CandidataModel[] = []
  public patrocinadores: PatrocinadorModel[] = []

  private destroy$ = new Subject<void>()
  private responseCandidatas$!: Observable<ResponseModel<CandidataModel[]>>
  private responsePatrocinadores$!: Observable<ResponseModel<PatrocinadorModel[]>>

  constructor(
    private _toast: ToastService,
    private _dialog: MatDialog,
    private _token: TokenService,
    private _premioService: PremioService,
    private _candidataService: CandidataService,
    private _patrocinadorService: PatrocinadorService,
  ) { }

  ngOnInit(): void {
    this.usuarioLogeado = this._token.getUsuario()
    this.loadData()
  }

  private loadData() {
    forkJoin([
      this._patrocinadorService.listar(),
      this._candidataService.listar(),
      this._premioService.listar()
    ]).pipe(takeUntil(this.destroy$)).subscribe({
      next: ([respuestaPatrocinador, respuestaCandidata, respuestaPremio]) => {
        this.patrocinadores = respuestaPatrocinador.data as PatrocinadorModel[]
        this.candidatas = respuestaCandidata.data as CandidataModel[]
        this.premios = respuestaPremio.data as PremioModel[]
      },
      error: () => this.loading.update(() => false),
      complete: () => this.loading.update(() => false)
    });
  }

  private toastMessage(data: ResponseModel<string>){
    if(data == undefined) return
    switch(data.status){
      case 200:
      case 201:
        this._toast.success(data.data)
        break
      case 400:
      case 404:
        this._toast.error(data.data)
    }
  }

  openComentario(data: CandidataModel): void {
    this._dialog.open(ModalComentarioComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: 'auto',
    })
  }

  openVotar(data: CandidataModel) {
    this._dialog.open(ModalVotacionComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: 'auto',
    }).afterClosed().subscribe((respuesta: ResponseModel<string>) => this.toastMessage(respuesta))
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
