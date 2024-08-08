import { estudiante } from './pages/estudiante/estudiante.routes';
import { Routes } from "@angular/router";

export const admin: Routes = [
    {
        path: '',
        children: [
            {
                path: 'gestion-candidata',
                title: 'Candidata | Reina Facultad',
                data: {
                    icon: 'bi bi-person-standing-dress',
                    label: 'Candidata',
                    roles: ['candidata']
                },
                loadComponent: () => import('./pages/candidata/candidata-main.component').then(c => c.CandidataMainComponent),
                loadChildren: () => import('./pages/candidata/candidata.routes').then(r => r.candidata)
            },
            {
                path: 'gestion-patrocinador',
                title: 'Patrocinador | Reina Facultad',
                data: {
                    icon: 'bi bi-building-fill',
                    label: 'Patrocinador',
                    roles: ['patrocinador']
                },
                loadComponent: () => import('./pages/patrocinador/patrocinador-main.component').then(c => c.PatrocinadorMainComponent),
                loadChildren: () => import('./pages/patrocinador/patrocinador.routes').then(r => r.patrocinador)
            },
            {
                path: 'gestion-estudiante',
                title: 'Estudiante | Reina Facultad',
                data: {
                    icon: 'bi bi-backpack-fill',
                    label: 'Estudiante',
                    roles: ['estudiante']
                },
                loadComponent: () => import('./pages/estudiante/estudiante-main.component').then(c => c.EstudianteMainComponent),
                loadChildren: () => import('./pages/estudiante/estudiante.routes').then(r => r.estudiante)
            }
        ]
    }
]
