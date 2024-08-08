import { Routes } from "@angular/router";

export const estudiante: Routes = [
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
                title: 'Estudiante Home | Reina Facultad',
                loadComponent: () => import('../estudiante/estudiante-home/estudiante-home.component').then(c => c.EstudianteHomeComponent)
            },
            {
                path: 'edit',
                title: 'Estudiante Editar Datos | Reina Facultad',
                data: {
                    icon: 'bi bi-pen-fill',
                    label: 'Editar Datos'
                },
                loadComponent: () => import('../estudiante/estudiante-edit/estudiante-edit.component').then(c => c.EstudianteEditComponent)
            },
            {
                path: 'delete',
                title: 'Estudiante Eliminar Cuenta | Reina Facultad',
                data: {
                    icon: 'bi bi-pen-fill',
                    label: 'Eliminar Cuenta'
                },
                loadComponent: () => import('../estudiante/estudiante-delete/estudiante-delete.component').then(c => c.EstudianteDeleteComponent)
            },
            {
                path: 'comentarios',
                title: 'Comentarios | Reina Facultad',
                data: {
                    icon: 'bi bi-chat-dots-fill',
                    label: 'Comentarios'
                },
                loadComponent: () => import('../estudiante/estudiante-comentarios/estudiante-comentarios.component').then(c => c.EstudianteComentariosComponent)
            },
            {
                path: 'voto',
                title: 'Voto | Reina Facultad',
                data: {
                    icon: 'bi bi-box2-heart-fill',
                    label: 'Mi Voto'
                },
                loadComponent: () => import('../estudiante/estudiante-voto/estudiante-voto.component').then(c => c.EstudianteVotoComponent)
            }
        ]
    }
]
