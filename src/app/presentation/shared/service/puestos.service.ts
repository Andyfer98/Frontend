import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PuestosService {

  public puestos = [
    { id: 'Primero', value: 'Primer Puesto' },
    { id: 'Segundo', value: 'Segundo Puesto' },
    { id: 'Tercero', value: 'Tercer Puesto' },
  ]

}
