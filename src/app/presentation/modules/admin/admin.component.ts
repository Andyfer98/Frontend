import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { admin } from './admin.routes';
import { TokenService } from '@UI/shared/service/token.service';
import { UsuarioLogeadoModel } from '@domain/models/usuario-logeado';
import { ToastService } from '@UI/shared/service/toast.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    AsyncPipe,
    RouterLink,
    RouterOutlet
  ]
})
export class AdminComponent {

  private _token = inject(TokenService)
  private _toast = inject(ToastService)
  private _router = inject(Router)
  private _breakpointObserver = inject(BreakpointObserver)
  public _usuarioLogeado: UsuarioLogeadoModel = this._token.getUsuario()

  isHandset$: Observable<boolean> = this._breakpointObserver.observe(Breakpoints.Handset)
    .pipe(map(result => result.matches), shareReplay())

  public routes = admin
    .map(route => route.children ?? [])
    .flat()
    .filter(route => route && route.path)
    .filter(route => route && !route.path?.includes(':'))
    .filter(route => route.data?.['roles'].includes(this._usuarioLogeado.rol))

  cerrarSesion() {
    this._token.clear()
    this._router.navigate([''])
    this._toast.success('Hasta pronto')
  }

}
