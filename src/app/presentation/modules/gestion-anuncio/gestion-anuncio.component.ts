import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { ResponseModel } from '@domain/base/response';
import { AnuncioService } from '@infrastructure/services/anuncio.service';
import { AnuncioModel } from '@domain/models/anuncio.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
@Component({
  selector: 'app-gestion-anuncio',
  standalone: true,
  imports: [MatInputModule, FormsModule, CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './gestion-anuncio.component.html',
  styleUrl: './gestion-anuncio.component.css'
})
export class GestionAnuncioComponent implements OnInit {

  // dataSource!: MatTableDataSource<AnuncioModel>;
  dataSource = new MatTableDataSource<AnuncioModel>();
  displayedColumns: string[] = ['titulo', 'descripcion', 'tipoAnuncio', 'actions'];

  anuncios: AnuncioModel[] = [];
  anuncio: AnuncioModel = {id: 0, titulo: '', descripcion:'', tipoAnuncio:''}

  constructor(private anuncioService: AnuncioService) { }

  ngOnInit(): void {
    this.getAnuncios();
  }

  onSubmit(): void {
    if (this.anuncio.id === 0) {
      this.addAnuncio(this.anuncio);
    } else {
      this.updateAnuncio(this.anuncio);
    }
  }

  // getAnuncios(): void {
  //   this.anuncioService.getAll().subscribe((response: ResponseModel<AnuncioModel[]>) => {
  //     this.anuncios = response.data;
  //   });
  // }
  getAnuncios(): void {
    this.anuncioService.getAll().subscribe((response: ResponseModel<AnuncioModel[]>) => {
      this.dataSource.data = response.data; // Asegúrate de que 'response.data' es un arreglo de 'AnuncioModel'
    });
  }

  getAnuncio(id: number): void {
    this.anuncioService.getById(id).subscribe((response: ResponseModel<AnuncioModel>) => {
      console.log(response.data);
    });
  }

  addAnuncio(anuncio: AnuncioModel): void {
    this.anuncioService.add(anuncio).subscribe((response: ResponseModel<string>) => {
      console.log("Error");
      this.getAnuncios(); // Actualizar la lista después de agregar
    });
  }

  // updateAnuncio(anuncio: AnuncioModel): void {
  //   this.anuncioService.update(anuncio).subscribe((response: ResponseModel<string>) => {
  //     console.log("Error");
  //     this.getAnuncios(); // Actualizar la lista después de actualizar
  //   });
  // }

  updateAnuncio(anuncio: AnuncioModel): void {
    this.anuncioService.update(anuncio).subscribe(
      (response: string) => {
        console.log("Response:", response); // Aquí imprimes la respuesta del servidor
        this.getAnuncios(); // Actualizar la lista después de actualizar
      },
      (error) => {
        console.error("Error", error); // Manejo de errores
      }
    );
  }
  

  deleteAnuncio(id: number): void {
    this.anuncioService.delete(id).subscribe((response: ResponseModel<string>) => {
      console.log("Error");
      this.getAnuncios(); // Actualizar la lista después de eliminar
    });
  }

  resetForm(): void {
    this.anuncio = { id: 0, titulo: '', descripcion: '' };
  }

  editAnuncio(anuncio: AnuncioModel): void {
    this.anuncio = { ...anuncio };
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  } 

}
