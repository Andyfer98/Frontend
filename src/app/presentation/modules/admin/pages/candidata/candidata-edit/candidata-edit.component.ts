import { Router } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ResponseModel } from '@domain/base/response';
import { CandidataModel } from '@domain/models/candidata.model';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';

import { ToastService } from '@UI/shared/service/toast.service';
import { TokenService } from '@UI/shared/service/token.service';
import { SemestresService } from '@UI/shared/service/semestres.service';

import { CandidataService } from '@infrastructure/services/candidata.service';

@Component({
  selector: 'app-candidata-edit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './candidata-edit.component.html',
  styleUrl: './candidata-edit.component.css'
})
export class CandidataEditComponent implements OnInit, OnDestroy {

  public form!: FormGroup
  public loading = signal<boolean>(false)

  private candidata!: CandidataModel
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<string>>

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _token: TokenService,
    public _semestreService: SemestresService,
    private _candidataService: CandidataService,
  ) { }

  ngOnInit(): void {
    this.initFrom()
    this.loadData()
  }

  private loadData() {
    const usuarioLogeado: UsuarioLogeadoModel = this._token.getUsuario()
    this._candidataService.consultar(usuarioLogeado.id!).subscribe({
      next: (data: ResponseModel<CandidataModel>) => {
        this.candidata = data.data
        this.initFromData(data.data)
      }
    })
  }

  private initFrom() {
    this.form = this._fb.group({
      nombresCompletos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      semestre: ['', Validators.required],
      propuesta: ['', Validators.required],
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    })
  }

  private initFromData(data: CandidataModel) {
    const fecha = new Date(data.fechaNacimiento!);
    this.form = this._fb.group({
      nombresCompletos: [data.nombresCompletos],
      fechaNacimiento: [fecha.toISOString().split('T')[0]],
      semestre: [data.semestre],
      propuesta: [data.propuesta],
      usuario: [data.usuario],
      contrasena: [data.contrasena],
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this._toast.error('Verifique la información ingresada.')
      return
    }

    const candidata: CandidataModel = {
      id: this.candidata.id,
      nombresCompletos: this.form.value.nombresCompletos,
      fechaNacimiento: this.form.value.fechaNacimiento,
      semestre: this.form.value.semestre,
      propuesta: this.form.value.propuesta,
      urlImagen: this.candidata.urlImagen,
      usuario: this.form.value.usuario,
      contrasena: this.form.value.contrasena
    }

    this.loading.update(() => true)

    this.response$ = this._candidataService.actualizar(candidata)
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
        this._router.navigate(['/admin/gestion-candidata/home'])
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
