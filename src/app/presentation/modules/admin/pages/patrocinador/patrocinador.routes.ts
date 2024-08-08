import { Routes } from "@angular/router";

export const patrocinador: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                redirectTo: 'home',
                pathMatch: 'full'
            },
            {
                path: 'home',
                title: 'Patrocinador Home | Reina Facultad',
                loadComponent: () => import('./../patrocinador/patrocinador-home/patrocinador-home.component').then(c => c.PatrocinadorHomeComponent)
            },
            {
                path: 'edit',
                title: 'Patrocinador Editar Datos | Reina Facultad',
                data: {
                    icon: 'bi bi-pen-fill',
                    label: 'Editar Datos'
                },
                loadComponent: () => import('./../patrocinador/patrocinador-edit/patrocinador-edit.component').then(c => c.PatrocinadorEditComponent)
            },                    
            {
                path: 'delete',
                title: 'Patrocinador Eliminar Cuenta | Reina Facultad',
                data: {
                    icon: 'bi bi-trash3-fill',
                    label: 'Eliminar Cuenta'
                },
                loadComponent: () => import('./../patrocinador/patrocinador-delete/patrocinador-delete.component').then(c => c.PatrocinadorDeleteComponent)
            },    
            {
                path: 'premios-list',
                title: 'Patrocinador Premios | Reina Facultad',
                data: {
                    icon: 'bi bi-trophy-fill',
                    label: 'Lista Premios'
                },
                loadComponent: () => import('./../patrocinador/patrocinador-premios-list/patrocinador-premios-list.component').then(c => c.PatrocinadorPremiosListComponent)
            }
        ]
    }
]
