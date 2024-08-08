import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '@UI/shared/service/toast.service';
import { TokenService } from '@UI/shared/service/token.service';

import { ResponseModel } from '@domain/base/response';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';
import { PatrocinadorModel } from '@domain/models/patrocinador.model';

import { PatrocinadorService } from '@infrastructure/services/patrocinador.service';

@Component({
  selector: 'app-patrocinador-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './patrocinador-edit.component.html',
  styleUrl: './patrocinador-edit.component.css'
}) 
export class PatrocinadorEditComponent implements OnInit, OnDestroy {

  public form!: FormGroup
  public loading = signal<boolean>(false)

  private patrocinador!: PatrocinadorModel
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<string>>

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _token: TokenService,
    private _patrocinadorService: PatrocinadorService,
  ) { }

  ngOnInit(): void {
    this.initFrom()
    this.loadData()
  }

  private loadData() {
    const usuarioLogeado: UsuarioLogeadoModel = this._token.getUsuario()
    this._patrocinadorService.consultar(usuarioLogeado.id!).subscribe({
      next: (data: ResponseModel<PatrocinadorModel>) => {
        this.patrocinador = data.data
        this.initFromData(data.data)
      }
    })
  }

  private initFrom() {
    this.form = this._fb.group({
      empresa: ['', Validators.required],
      website: ['', Validators.required],
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    })
  }

  private initFromData(data: PatrocinadorModel) {
    this.form = this._fb.group({
      empresa: [data.empresa],
      website: [data.website],
      usuario: [data.usuario],
      contrasena: [data.contrasena]
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this._toast.error('Verifique la información ingresada.')
      return
    }

    const patrocinador: PatrocinadorModel = {
      id: this.patrocinador.id,
      empresa: this.form.value.empresa,
      website: this.form.value.website,
      urlLogo: this.patrocinador.urlLogo,
      usuario: this.form.value.usuario,
      contrasena: this.form.value.contrasena
    }
console.log(patrocinador);

    this.loading.update(() => true)

    this.response$ = this._patrocinadorService.actualizar(patrocinador)
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel<string>) => this.handleSuccess(data),
      error: (err) => this._toast.error('Lo sentimos, intente mas luego.'),
      complete: () => this.loading.update(() => false)
    })

  }

  private handleSuccess(data: ResponseModel<string>) {
    switch (data.status) {
      case 200:
        this._toast.success(data.data as string)
        this.form.reset()
        this._router.navigate(['/admin/gestion-patrocinador/home'])
        break;

      case 400:
      case 404:
        this._toast.error(data.data as string)
        break;

      default:
        this._toast.error('Ah ocurrido un error')
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
