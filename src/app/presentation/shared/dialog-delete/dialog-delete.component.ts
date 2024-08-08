import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-delete',
  standalone: true,
  imports: [],
  templateUrl: './dialog-delete.component.html',
  styleUrl: './dialog-delete.component.css'
})
export class DialogDeleteComponent {

  constructor(
    private _dialogRef: MatDialogRef<DialogDeleteComponent>,
  ) { }

  onSubmit() {
    this._dialogRef.close(true)
  }

}
