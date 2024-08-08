import { Component } from '@angular/core';
import { patrocinador } from '../patrocinador.routes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-patrocinador-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './patrocinador-home.component.html',
  styleUrl: './patrocinador-home.component.css'
})
export class PatrocinadorHomeComponent {

  public routes = patrocinador
    .map(route => route.children ?? [])
    .flat()
    .filter(route => route && route.path)
    .filter(route => route.path !== 'home')

}
