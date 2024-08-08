import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, Inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '@UI/shared/service/toast.service';

import { PremioService } from '@infrastructure/services/premio.service';

import { ResponseModel } from '@domain/base/response';
import { PremioModel } from '@domain/models/premio.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TokenService } from '@UI/shared/service/token.service';
import { PuestosService } from '@UI/shared/service/puestos.service';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';

@Component({
  selector: 'app-patrocinador-premios-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './patrocinador-premios-form.component.html',
  styleUrl: './patrocinador-premios-form.component.css'
})
export class PatrocinadorPremiosFormComponent implements OnInit, OnDestroy {

  public title: string = 'Información Requerida'
  public btnTitle: string = 'Agregar'

  public form!: FormGroup
  public loading = signal<boolean>(false)

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<string>>

  constructor(
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _token: TokenService,
    private _premioService: PremioService,
    public _puestosService: PuestosService,
    @Inject(MAT_DIALOG_DATA) public data: PremioModel,
    private _dialogRef: MatDialogRef<PatrocinadorPremiosFormComponent>,
  ) { }

  ngOnInit(): void {
    this.initForm()
    if (this.data) {
      this.initFormData(this.data)
    }
  }

  private initForm() {
    this.form = this._fb.group({
      nombre: ['', Validators.required],
      puesto: ['', Validators.required],
      descripcion: ['', Validators.required],
    })
  }

  private initFormData(data: PremioModel) {
    this.title = 'Información editable'
    this.btnTitle = 'Editar'
    this.form = this._fb.group({
      nombre: [data.nombre],
      puesto: [data.puesto],
      descripcion: [data.descripcion],
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this._toast.error('Verifique la información ingresada.')
      return
    }

    const usuarioLogeado: UsuarioLogeadoModel = this._token.getUsuario()

    const premio: PremioModel = {
      id: this.data ? this.data.id : 0,
      nombre: this.form.value.nombre,
      patrocinadorId: usuarioLogeado.id,
      puesto: this.form.value.puesto,
      descripcion: this.form.value.descripcion
    }

    this.loading.update(() => true)

    this.response$ = this.data
      ? this._premioService.actualizar(premio)
      : this._premioService.agregar(premio)

    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel<string>) => this._dialogRef.close(data),
      error: (err) => this._toast.error('Lo sentimos, intente mas luego.'),
      complete: () => this.loading.update(() => false)
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
