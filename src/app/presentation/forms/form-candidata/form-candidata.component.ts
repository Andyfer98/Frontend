import { Router, RouterLink } from '@angular/router';
import { from, Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ToastService } from '@UI/shared/service/toast.service';
import { SemestresService } from '@UI/shared/service/semestres.service';

import { ResponseModel } from '@domain/base/response';
import { CandidataModel } from '@domain/models/candidata.model';

import { CandidataService } from '@infrastructure/services/candidata.service';
import { FileUploadService } from '@UI/shared/common/file-upload.service';

@Component({
  selector: 'app-form-candidata',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './form-candidata.component.html',
  styleUrl: './form-candidata.component.css'
})
export class FormCandidataComponent implements OnInit, OnDestroy {

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
    public _semestreService: SemestresService,
    private _candidataService: CandidataService,
  ) { }

  ngOnInit(): void {
    this.initFrom()
  }

  private initFrom() {
    this.form = this._fb.group({
      nombresCompletos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      semestre: ['', Validators.required],
      urlImagen: ['', Validators.required],
      propuesta: ['', Validators.required],
      usuario: ['', Validators.required],
      contrasena: ['', Validators.required]
    })
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0] as File
    const sizeLimit = 5 * 1024 * 1024;
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

    if (file.size > sizeLimit) {
      this.form.value.urlImagen.setValue(null)
      this._toast.error('El archivo no debe pesar más de 5 MB.');
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      this.urlImagen.setValue(null);
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

    const candidata: CandidataModel = {
      nombresCompletos: this.form.value.nombresCompletos,
      fechaNacimiento: this.form.value.fechaNacimiento,
      semestre: this.form.value.semestre,
      propuesta: this.form.value.propuesta,
      usuario: this.form.value.usuario,
      contrasena: this.form.value.contrasena
    }

    this.loading.update(() => true)

    const image$ = this._fileUpload.uploadFileAndGetURL(this.archivoImage)

    from(image$).pipe(takeUntil(this.destroy$)).subscribe({
      next: (urlImagen: string) => {
        const candidataConImagen: CandidataModel & { urlImagen: string } = {
          ...candidata,
          urlImagen
        };

        this.response$ = this._candidataService.agregar(candidataConImagen)
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
        this._router.navigate(['/login', 'candidata'])
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

  get urlImagen() { return this.form.get('urlImagen')! }


}
