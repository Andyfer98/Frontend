import { Routes } from "@angular/router";

export const candidata: Routes = [
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
                title: 'Candidata Home | Reina Facultad',
                loadComponent: () => import('./../candidata/candidata-home/candidata-home.component').then(c => c.CandidataHomeComponent)
            },
            {
                path: 'editar',
                data: {
                    icon: 'bi bi-pen-fill',
                    label: 'Editar Datos'
                },
                title: 'Editar Datos | Reina Facultad',
                loadComponent: () => import('./../candidata/candidata-edit/candidata-edit.component').then(c => c.CandidataEditComponent)
            },
            {
                path: 'eliminar',
                data: {
                    icon: 'bi bi-trash3-fill',
                    label: 'Eliminar Cuenta'
                },
                title: 'Eliminar Cuenta | Reina Facultad',
                loadComponent: () => import('./../candidata/candidata-delete/candidata-delete.component').then(c => c.CandidataDeleteComponent)
            },
            {
                path: 'comentarios',
                title: 'Comentarios | Reina Facultad',
                data: {
                    icon: 'bi bi-chat-left-text-fill',
                    label: 'Comentarios'
                },
                loadComponent: () => import('../candidata/candidata-comentarios/candidata-comentarios.component').then(c => c.CandidataComentariosComponent)
            },
            {
                path: 'voto',
                title: 'Voto | Reina Facultad',
                data: {
                    icon: 'bi bi-box2-heart-fill',
                    label: 'Mis Votos'
                },
                loadComponent: () => import('../candidata/candidata-votos/candidata-votos.component').then(c => c.CandidataVotosComponent)
            }
        ]
    }
]
