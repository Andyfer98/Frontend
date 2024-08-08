import { Routes } from '@angular/router';
import { AccesoGuard } from '@UI/core/acceso.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { 
        path: 'home',
        title: 'Home | Elección Reina de Facultad',
        loadComponent: () => import('./../../presentation/home/home.component').then(c => c.HomeComponent)
    },
    { 
        path: 'login/:value',
        title: 'Login | Elección Reina de Facultad',
        loadComponent: () => import('./../../presentation/authentication/authentication.component').then(c => c.AuthenticationComponent)
    },
    { 
        path: 'form-estudiante',
        title: 'Formulario Estudiante | Elección Reina de Facultad',
        loadComponent: () => import('./../../presentation/forms/form-estudiante/form-estudiante.component').then(c => c.FormEstudianteComponent)
    },
    { 
        path: 'form-candidata',
        title: 'Formulario Cantidata | Elección Reina de Facultad',
        loadComponent: () => import('./../../presentation/forms/form-candidata/form-candidata.component').then(c => c.FormCandidataComponent)
    },
    { 
        path: 'form-patrocinador',
        title: 'Formulario Patrocinador | Elección Reina de Facultad',
        loadComponent: () => import('./../../presentation/forms/form-patrocinador/form-patrocinador.component').then(c => c.FormPatrocinadorComponent)
    },
    { 
        path: 'principal',
        title: 'Home | Elección Reina de Facultad',
        canActivate: [AccesoGuard(['estudiante'])],
        loadComponent: () => import('./../../presentation/modules/home/home.component').then(c => c.HomeComponent)
    },
    { 
        path: 'admin',
        title: 'Admin | Elección Reina de Facultad',
        canActivate: [AccesoGuard(['estudiante','candidata','patrocinador'])],
        loadComponent: () => import('./../../presentation/modules/admin/admin.component').then(c => c.AdminComponent),
        loadChildren: () => import('./../../presentation/modules/admin/admin.routes').then(r => r.admin)
    },
    { 
        path: 'form-anuncio',
        title: 'Formulario Anuncio | Gestion de anuncios',
        loadComponent: () => import('./../../presentation/modules/gestion-anuncio/gestion-anuncio.component').then(c => c.GestionAnuncioComponent)
    },
    { 
        path: 'form-articulo',
        title: 'Formulario Articulo | Gestion de Articulos',
        loadComponent: () => import('./../../presentation/modules/gestion-articulo/gestion-articulo.component').then(c => c.GestionArticuloComponent)
    }
];
