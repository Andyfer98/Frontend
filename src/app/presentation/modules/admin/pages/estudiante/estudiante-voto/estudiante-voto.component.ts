import { Observable, Subject, takeUntil } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { VotoModel } from '@domain/models/voto.model';
import { ResponseModel } from '@domain/base/response';

import { ToastService } from '@UI/shared/service/toast.service';
import { TokenService } from '@UI/shared/service/token.service';

import { VotoService } from '@infrastructure/services/voto.service';

@Component({
  selector: 'app-estudiante-voto',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './estudiante-voto.component.html',
  styleUrl: './estudiante-voto.component.css'
})
export class EstudianteVotoComponent implements OnInit, OnDestroy {
  
  public voto!: ResponseModel<VotoModel>

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<string>>
  private responseVoto$!: Observable<ResponseModel<VotoModel>>

  constructor(
    private _router: Router,
    private _toast: ToastService,
    private _token: TokenService,
    private _votoService: VotoService
  ){}

  ngOnInit(): void {
    this.loadVoto()
  }

  private loadVoto(){
    const usuarioLogeado = this._token.getUsuario()
    this.responseVoto$ = this._votoService.consultarByIdEstudiante(usuarioLogeado.id!)
    this.responseVoto$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.voto = data
    })
  }

  onSubmit(){
    this.response$ = this._votoService.eliminar(this.voto.data.id!)
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if(data.status == 200){
          this._toast.success(data.data)
          this._router.navigate(['/admin/gestion-estudiante/home'])
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
