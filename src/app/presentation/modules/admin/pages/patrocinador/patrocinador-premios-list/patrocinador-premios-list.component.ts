import { Observable, Subject, takeUntil } from 'rxjs';
import { Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';

import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { ResponseModel } from '@domain/base/response';
import { PremioModel } from '@domain/models/premio.model';

import { TokenService } from '@UI/shared/service/token.service';
import { ToastService } from '@UI/shared/service/toast.service';

import { PremioService } from '@infrastructure/services/premio.service';
import { PatrocinadorPremiosFormComponent } from '../patrocinador-premios-form/patrocinador-premios-form.component';
import { DialogDeleteComponent } from '@UI/shared/dialog-delete/dialog-delete.component';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';

@Component({
  selector: 'app-patrocinador-premios-list',
  standalone: true,
  imports: [
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatProgressBarModule,
  ],
  templateUrl: './patrocinador-premios-list.component.html',
  styleUrl: './patrocinador-premios-list.component.css'
})
export class PatrocinadorPremiosListComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['nombre', 'puesto', 'descripcion', 'acciones'];
  dataSource = new MatTableDataSource<PremioModel>();

  public loading = signal<boolean>(false)
  private destroy$ = new Subject<void>()
  private response$!: Observable<ResponseModel<PremioModel[]>>

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private _token: TokenService,
    private _toast: ToastService,
    private _premioService: PremioService,
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    if (this.dataSource.data.length > 0) {
      this.paginator._intl.itemsPerPageLabel = "Items por Página ";
    }
  }

  // Configura la ordenación de la tabla
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.loadPremios()
  }

  private loadPremios() {
    this.loading.set(true)
    const usuarioLogeado: UsuarioLogeadoModel = this._token.getUsuario()
    this.response$ = this._premioService.listarPorPatrocinador(usuarioLogeado.id!)
    this.response$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: ResponseModel<PremioModel[]>) => this.dataSource.data = data.data,
      error: (err) => this._toast.error('Lo sentimos, intente mas luego.'),
      complete: () => this.loading.update(() => false)
    })
  }

  openAdd() {
    this.dialog.open(PatrocinadorPremiosFormComponent, {
      autoFocus: false,
      disableClose: false,
      width: '500px'
    }).afterClosed().subscribe((respuesta: ResponseModel<string>) => this.toastMessage(respuesta))
  }

  openEdit(data: PremioModel) {
    this.dialog.open(PatrocinadorPremiosFormComponent, {
      autoFocus: false,
      disableClose: false,
      data: data,
      width: '550px'
    }).afterClosed().subscribe((respuesta: ResponseModel<string>) => this.toastMessage(respuesta))
  }

  openDelete(data: PremioModel) {
    this.openConfirmationDialog().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this._premioService.eliminar(data.id!).subscribe({
          next: (respuesta: ResponseModel<string>) => this.toastMessage(respuesta)
        })
      }
    });
  }

  openConfirmationDialog(): Observable<boolean> {
    return this.dialog.open(DialogDeleteComponent, {
      autoFocus: false,
      disableClose: false,
      width: 'auto',    
    }).afterClosed();
  }

  private toastMessage(data: ResponseModel<string>){
    if(data == undefined) return
    switch(data.status){
      case 200:
      case 201:
        this._toast.success(data.data)
        this.loadPremios()
        break
      case 400:
      case 404:
        this._toast.error('Intenta luego')
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

}
