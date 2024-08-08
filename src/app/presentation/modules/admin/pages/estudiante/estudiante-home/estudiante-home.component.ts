import { Component } from '@angular/core';
import { estudiante } from '../estudiante.routes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-estudiante-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './estudiante-home.component.html',
  styleUrl: './estudiante-home.component.css'
})
export class EstudianteHomeComponent {

  public routes = estudiante
    .map(route => route.children ?? [])
    .flat()
    .filter(route => route && route.path)
    .filter(route => route.path !== 'home')
  
}
