import { Router, RouterLink } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '@UI/shared/service/toast.service';
import { SemestresService } from '@UI/shared/service/semestres.service';

import { EstudianteService } from '@infrastructure/services/estudiante.service';

import { ResponseModel } from '@domain/base/response';
import { EstudianteModel } from '@domain/models/estudiante.model';

@Component({
  selector: 'app-form-estudiante',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-estudiante.component.html',
  styleUrl: './form-estudiante.component.css'
})
export class FormEstudianteComponent implements OnInit, OnDestroy {

  public form!: FormGroup
  public loading = signal<boolean>(false)

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<string>>

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    public _semestreService: SemestresService,
    private _estudianteService: EstudianteService,
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  private initForm() {
    this.form = this._fb.group({
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      semestre: ['', Validators.required],
      correo: ['', Validators.required],
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this._toast.error('Verifique la información ingresada.')
      return
    }

    const estudiante: EstudianteModel = {
      nombres: this.form.value.nombres,
      apellidos: this.form.value.apellidos,
      semestre: this.form.value.semestre,
      correoInstitucional: this.form.value.correo,
      usuario: this.form.value.usuario,
      contrasena: this.form.value.contrasena
    }

    this.loading.update(() => true)
    this.response$ = this._estudianteService.agregar(estudiante)
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel<string>) => this.handleSuccess(data),
      error: (err) => this._toast.error('Lo sentimos, intente mas luego.'),
      complete: () => this.loading.update(() => false)
    })
  }

  private handleSuccess(data: ResponseModel<string>) {
    switch (data.status) {
      case 201:
        this._toast.success(data.data as string)
        this.form.reset()
        this._router.navigate(['/login', 'estudiante'])
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
