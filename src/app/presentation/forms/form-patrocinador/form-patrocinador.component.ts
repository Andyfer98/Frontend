import { Router, RouterLink } from '@angular/router';
import { from, Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '@UI/shared/service/toast.service';
import { FileUploadService } from '@UI/shared/common/file-upload.service';

import { ResponseModel } from '@domain/base/response';
import { PatrocinadorModel } from '@domain/models/patrocinador.model';

import { PatrocinadorService } from '@infrastructure/services/patrocinador.service';

@Component({
  selector: 'app-form-patrocinador',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-patrocinador.component.html',
  styleUrl: './form-patrocinador.component.css'
})
export class FormPatrocinadorComponent implements OnInit, OnDestroy {

  public form!: FormGroup
  public loading = signal<boolean>(false)

  private archivoImage!: File
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<string>>

  constructor(
    private _router: Router,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _fileUpload: FileUploadService,
    private _patrocinadorService: PatrocinadorService,
  ) { }

  ngOnInit(): void {
    this.initFrom()
  }

  private initFrom() {
    this.form = this._fb.group({
      empresa: ['', Validators.required],
      website: ['', Validators.required],
      urlLogo: ['', Validators.required],
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    })
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] as File
    const sizeLimit = 5 * 1024 * 1024;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (file.size > sizeLimit) {
      this.form.value.urlLogo.setValue(null)
      this._toast.error('El archivo no debe pesar más de 5 MB.');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      this.urlLogo.setValue(null);
      this._toast.error('Solo se permiten archivos PNG, JPG o JPEG.');
      return
    }
    this.archivoImage = file
  }

  onSubmit() {
    if (this.form.invalid) {
      this._toast.error('Verifique la información ingresada.')
      return
    }

    const patrocinador: PatrocinadorModel = {
      empresa: this.form.value.empresa,
      website: this.form.value.website,
      urlLogo: this.form.value.urlLogo,
      usuario: this.form.value.usuario,
      contrasena: this.form.value.contrasena
    }

    this.loading.update(() => true)

    const image$ = this._fileUpload.uploadFileAndGetURL(this.archivoImage)

    from(image$).pipe(takeUntil(this.destroy$)).subscribe({
      next: (urlLogo: string) => {
        const patrocinadorConLogo: PatrocinadorModel & { urlLogo: string } = {
          ...patrocinador,
          urlLogo
        };

        this.response$ = this._patrocinadorService.agregar(patrocinadorConLogo)
        this.response$.pipe(takeUntil(this.destroy$)).subscribe({
          next: (data: ResponseModel<string>) => this.handleSuccess(data),
          error: (err) => this._toast.error('Lo sentimos, intente mas luego.'),
          complete: () => this.loading.update(() => false)
        })
      },
      error: () => {
        this._toast.error('Error al subir la imagen. Intente más tarde.');
        this.loading.update(() => false);
      }
    });
  }

  private handleSuccess(data: ResponseModel<string>) {
    switch (data.status) {
      case 201:
        this._toast.success(data.data as string)
        this.form.reset()
        this._router.navigate(['/login', 'Patrocinador'])
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

  get urlLogo() { return this.form.get('urlLogo')! }

}
