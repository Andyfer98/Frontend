import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ResponseModel } from '@domain/base/response';
import { CandidataModel } from '@domain/models/candidata.model';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';
import { VotoModel } from '@domain/models/voto.model';
import { VotoService } from '@infrastructure/services/voto.service';
import { TokenService } from '@UI/shared/service/token.service';
import { Observable, Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-modal-votacion',
  standalone: true,
  imports: [],
  templateUrl: './modal-votacion.component.html',
  styleUrl: './modal-votacion.component.css'
})
export class ModalVotacionComponent implements OnDestroy {

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<string>>

  constructor(
    private _token: TokenService,
    private _votoService: VotoService,
    @Inject(MAT_DIALOG_DATA) public data: CandidataModel,
    private _dialogRef: MatDialogRef<ModalVotacionComponent>,
  ) { }

  onSubmit() {
    const usuarioLogeado: UsuarioLogeadoModel = this._token.getUsuario()

    const voto: VotoModel = {
      estudianteId: usuarioLogeado.id,
      candidataId: this.data.id,
      fechaVotacion: new Date
    }

    this.response$ = this._votoService.agregar(voto)
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this._dialogRef.close(data)
    })

  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
