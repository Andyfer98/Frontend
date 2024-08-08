import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ResponseModel } from '@domain/base/response';
import { ToastService } from '@UI/shared/service/toast.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from "@angular/material/input";
import { ArticuloModel } from '@domain/models/articulo.model';
import { ArticuloService } from '@infrastructure/services/articulo.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gestion-articulo',
  standalone: true,
  imports: [MatInputModule, FormsModule, CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './gestion-articulo.component.html',
  styleUrl: './gestion-articulo.component.css'
})
export class GestionArticuloComponent {

  dataSource = new MatTableDataSource<ArticuloModel>();
  displayedColumns: string[] = ['titulo', 'contenido', 'autor', 'fechaCreacion','actions'];

  articulos: ArticuloModel[] = [];
  articulo: ArticuloModel = {id: 0, titulo: '', contenido:'', autor:'', fechaCreacion: new Date()}

  constructor(private articuloService: ArticuloService) { }

  ngOnInit(): void {
    this.getArticulos();
  }

  onSubmit(): void {
    if (this.articulo.id === 0) {
      this.addArticulo(this.articulo);
    } else {
      this.updateArticulo(this.articulo);
    }
  }

  getArticulos(): void {
    this.articuloService.getAll().subscribe((response: ResponseModel<ArticuloModel[]>) => {
      this.dataSource.data = response.data; // Asegúrate de que 'response.data' es un arreglo de 'AnuncioModel'
    });
  }

  getArticulo(id: number): void {
    this.articuloService.getById(id).subscribe((response: ResponseModel<ArticuloModel>) => {
      console.log(response.data);
    });
  }

  addArticulo(articulo: ArticuloModel): void {
    this.articuloService.add(articulo).subscribe((response: ResponseModel<string>) => {
      console.log("Error");
      this.getArticulos(); // Actualizar la lista después de agregar
    });
  }

  updateArticulo(articulo: ArticuloModel): void {
    this.articuloService.update(articulo).subscribe(
      (response: string) => {
        console.log("Response:", response); // Aquí imprimes la respuesta del servidor
        this.getArticulos(); // Actualizar la lista después de actualizar
      },
      (error) => {
        console.error("Error", error); // Manejo de errores
      }
    );
  }

  deleteArticulo(id: number): void {
    this.articuloService.delete(id).subscribe((response: ResponseModel<string>) => {
      console.log("Eliminado");
      this.getArticulos(); // Actualizar la lista después de eliminar
    });
  }

  resetForm(): void {
    this.articulo = { id: 0, titulo: '', contenido:'', autor:'', fechaCreacion: new Date() };
  }

  editArticulo(articulo: ArticuloModel): void {
    this.articulo = { ...articulo };
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  } 

}
