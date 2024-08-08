import { Router } from '@angular/router';
import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject, takeUntil } from 'rxjs';

import { ResponseModel } from '@domain/base/response';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';

import { CandidataService } from '@infrastructure/services/candidata.service';

import { ToastService } from '@UI/shared/service/toast.service';
import { TokenService } from '@UI/shared/service/token.service';
import { DialogDeleteComponent } from '@UI/shared/dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-candidata-delete',
  standalone: true,
  imports: [],
  templateUrl: './candidata-delete.component.html',
  styleUrl: './candidata-delete.component.css'
})
export class CandidataDeleteComponent implements OnDestroy {

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<string>>

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _token: TokenService,
    private _toast: ToastService,
    private _candidataService: CandidataService,
  ) { }

  openDelete() {
    const usuarioLogeado: UsuarioLogeadoModel = this._token.getUsuario()
    this.openConfirmationDialog().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.response$ = this._candidataService.eliminar(usuarioLogeado.id!)
        this.response$.pipe(takeUntil(this.destroy$)).subscribe({
          next: (respuesta: ResponseModel<string>) => {
            this._toast.success(respuesta.data)
            this._router.navigate([''])
          }
        })
      }
    });
  }

  openConfirmationDialog(): Observable<boolean> {
    return this._dialog.open(DialogDeleteComponent, {
      autoFocus: false,
      disableClose: false,
      width: 'auto',
    }).afterClosed();
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
