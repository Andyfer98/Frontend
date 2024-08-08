import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ResponseModel } from '@domain/base/response';
import { EstudianteModel } from '@domain/models/estudiante.model';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';

import { ToastService } from '@UI/shared/service/toast.service';
import { TokenService } from '@UI/shared/service/token.service';
import { SemestresService } from '@UI/shared/service/semestres.service';

import { EstudianteService } from '@infrastructure/services/estudiante.service';

@Component({
  selector: 'app-estudiante-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './estudiante-edit.component.html',
  styleUrl: './estudiante-edit.component.css'
})
export class EstudianteEditComponent {

  public form!: FormGroup
  public loading = signal<boolean>(false)

  private estudiante!: EstudianteModel
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<string>>

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _token: TokenService,
    public _semestreService: SemestresService,
    private _estudianteService: EstudianteService,
  ) { }

  ngOnInit(): void {
    this.initFrom()
    this.loadData()
  }

  private loadData() {
    const usuarioLogeado: UsuarioLogeadoModel = this._token.getUsuario()
    this._estudianteService.consultar(usuarioLogeado.id!).subscribe({
      next: (data: ResponseModel<EstudianteModel>) => {
        this.estudiante = data.data
        this.initFromData(data.data)
      }
    })
  }

  private initFrom() {
    this.form = this._fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      semestre: ['', Validators.required],
      correo: ['', Validators.required],
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required],
    })
  }

  private initFromData(data: EstudianteModel) {
    this.form = this._fb.group({
      nombres: [data.nombres],
      apellidos: [data.apellidos],
      semestre: [data.semestre],
      correo: [data.correoInstitucional],
      usuario: [data.usuario],
      contrasena: [data.contrasena],
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this._toast.error('Verifique la información ingresada.')
      return
    }

    const estudiante: EstudianteModel = {
      id: this.estudiante.id,
      nombres: this.form.value.nombres,
      apellidos: this.form.value.apellidos,
      semestre: this.form.value.semestre,
      correoInstitucional: this.form.value.correo,
      usuario: this.form.value.usuario,
      contrasena: this.form.value.contrasena
    }

    this.loading.update(() => true)

    this.response$ = this._estudianteService.actualizar(estudiante)
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
        this._router.navigate(['/admin/gestion-estudiante/home'])
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
