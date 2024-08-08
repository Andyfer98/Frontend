import { Observable, Subject, takeUntil } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';

import { ResponseModel } from '@domain/base/response';
import { CandidataModel } from '@domain/models/candidata.model';
import { ComentarioModel } from '@domain/models/comentario.model';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';

import { ToastService } from '@UI/shared/service/toast.service';
import { TokenService } from '@UI/shared/service/token.service';

import { ComentarioService } from '@infrastructure/services/comentario.service';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-comentario',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-comentario.component.html',
  styleUrl: './modal-comentario.component.css'
})
export class ModalComentarioComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  public form!: FormGroup
  public loading = signal<boolean>(false)
  public comentarios: ComentarioModel[] = []

  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<ComentarioModel[]>>
  private responseComentario$!: Observable<ResponseModel<string>>

  @ViewChild('container') container!: ElementRef<HTMLDivElement>

  constructor(
    private _fb: FormBuilder,
    private _token: TokenService,
    private _toast: ToastService,
    private cdr: ChangeDetectorRef,
    private _comentarioService: ComentarioService,
    @Inject(MAT_DIALOG_DATA) public data: CandidataModel,
    private _dialogRef: MatDialogRef<ModalComentarioComponent>,
  ) { }

  ngOnInit(): void {
    this.initForm()
    this.loadComentarios()    
  }

  private initForm() {
    this.form = this._fb.group({
      comentario: ['', Validators.required]
    })
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
    this.cdr.detectChanges();
  }

  close() {
    this._dialogRef.close()
  }

  onSubmit() {
    if (this.form.invalid || this.isMessageEmpty(this.comentario.value)) return

    const usuarioLogeado: UsuarioLogeadoModel = this._token.getUsuario()

    const comentario: ComentarioModel = {
      comentario: this.comentario.value,
      estudianteId: usuarioLogeado.id,
      candidataId: this.data.id,
      fechaRegistro: new Date
    }

    this.responseComentario$ = this._comentarioService.agregar(comentario)
    this.responseComentario$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.toastMessage(data)
    })
  }

  private toastMessage(data: ResponseModel<string>) {
    if (data == undefined) return
    switch (data.status) {
      case 200:
      case 201:
        this._toast.success(data.data)
        this.form.reset()
        this.loadComentarios()
        break
      case 400:
      case 404:
        this._toast.error('Intenta luego')
    }
  }

  private loadComentarios() {
    this.response$ = this._comentarioService.consultarByIdCandidata(this.data.id!)
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => this.comentarios = data.data
    })
  }

  private scrollToBottom(): void {
    if (this.container) {
      this.container.nativeElement.scrollTop = this.container.nativeElement.scrollHeight;
    }
  }

  private isMessageEmpty(message: string): boolean {
    return (message || '').trim().length === 0;
  }

  private limpiar(): void {
    this.loadComentarios()
  }


  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  get comentario() { return this.form.get('comentario')! }

}
