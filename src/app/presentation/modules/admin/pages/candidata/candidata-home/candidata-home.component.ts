import { Component } from '@angular/core';
import { candidata } from '../candidata.routes';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-candidata-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './candidata-home.component.html',
  styleUrl: './candidata-home.component.css'
})
export class CandidataHomeComponent {

  public routes = candidata
    .map(route => route.children ?? [])
    .flat()
    .filter(route => route && route.path)
    .filter(route => route.path !== 'home')

}
