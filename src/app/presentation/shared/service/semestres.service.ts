import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SemestresService {

  public semestres = [
    { id: 'primero', value: 'Primer Semestre' },
    { id: 'segundo', value: 'Segundo Semestre' },
    { id: 'tercero', value: 'Tercer Semestre' },
    { id: 'cuarto', value: 'Cuarto Semestre' },
    { id: 'quinto', value: 'Quinto Semestre' },
    { id: 'sexto', value: 'Sexto Semestre' },
    { id: 'septimo', value: 'Séptimo Semestre' },
    { id: 'octavo', value: 'Octavo Semestre' },
    { id: 'noveno', value: 'Noveno Semestre' },
    { id: 'decimo', value: 'Décimo Semestre' }
  ]
  
}
