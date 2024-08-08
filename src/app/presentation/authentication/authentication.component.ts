import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '@UI/shared/service/toast.service';

import { AuthenticationService } from '@infrastructure/services/authentication.service';

import { ResponseModel } from '@domain/base/response';
import { AuthenticationModel } from '@domain/models/authentication.model';
import { TokenService } from '@UI/shared/service/token.service';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';

@Component({
  selector: 'app-authentication',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './authentication.component.html',
  styleUrl: './authentication.component.css'
})
export class AuthenticationComponent implements OnInit, OnDestroy {

  public form!: FormGroup
  public value!: string;

  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<string>>

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _token: TokenService,
    private _toast: ToastService,
    private _route: ActivatedRoute,
    private _auth: AuthenticationService,
  ) { }

  ngOnInit() {
    this._token.clear()
    this._route.paramMap.subscribe(params => {
      this.value = params.get('value')!;
    });
    this.initForm()
  }

  private initForm() {
    this.form = this._fb.group({
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    })
  }

  onSubmit() {
    if (this.form.invalid) {
      this._toast.error('Verifique la información ingresada.')
      return
    }

    const estudiante: AuthenticationModel = {
      usuario: this.form.value.usuario,
      contrasena: this.form.value.contrasena
    }

    this.loading.update(() => true)
    this.response$ = this._auth.login(estudiante, this.value)
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel<string>) => this.handleSuccess(data),
      error: (err) => this._toast.error('Lo sentimos, intente mas luego.'),
      complete: () => this.loading.update(() => false)
    })
  }

  private handleSuccess(data: ResponseModel<string>) {
    switch (data.status) {
      case 200:
        this._token.create(data.data)
        const rol: UsuarioLogeadoModel = this._token.getUsuario()
        this.router(rol.rol!)
        this._toast.success("Bienvenido")
        this.form.reset()
        break;

      case 400:
      case 404:
      case 401:
        this._toast.error(data.data as string)
        break;

      default:
        this._toast.error('Ah ocurrido un error')
        break;
    }
  }

  private router(value: string) {
    switch (value) {

      case 'estudiante':
        this._router.navigate(['principal'])
        break

      case 'candidata':
        this._router.navigate(['admin'])
        break

      case 'patrocinador':
        this._router.navigate(['admin'])
        break
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
