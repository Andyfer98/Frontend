import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseModel } from '@domain/base/response';
import { ComentarioModel } from '@domain/models/comentario.model';
import { ComentarioService } from '@infrastructure/services/comentario.service';
import { ToastService } from '@UI/shared/service/toast.service';
import { TokenService } from '@UI/shared/service/token.service';
import { Subject, Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'app-candidata-comentarios',
  standalone: true,
  imports: [],
  templateUrl: './candidata-comentarios.component.html',
  styleUrl: './candidata-comentarios.component.css'
})
export class CandidataComentariosComponent implements OnInit, OnDestroy {

  public comentarios!: ResponseModel<ComentarioModel[]>

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<string>>
  private responseComentarios$!: Observable<ResponseModel<ComentarioModel[]>>

  constructor(
    private _router: Router,
    private _toast: ToastService,
    private _token: TokenService,
    private _comentarioService: ComentarioService
  ){}

  ngOnInit(): void {
    this.loadComentarios()
  }

  private loadComentarios(){
    const usuarioLogeado = this._token.getUsuario()
    this.responseComentarios$ = this._comentarioService.consultarByIdCandidata(usuarioLogeado.id!)
    this.responseComentarios$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.comentarios = data
    })
  }

  onSubmit(id: number){
    this.response$ = this._comentarioService.eliminar(id)
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if(data.status == 200){
          this._toast.success(data.data)
          this.loadComentarios()
        } else {
          this._toast.error(data.data)
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }


}
