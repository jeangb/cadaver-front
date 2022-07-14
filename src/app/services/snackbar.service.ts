import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  constructor(private matSnackBar: MatSnackBar) { }

  displayMessage(msg: string){
    this.matSnackBar.open(msg, "Fermer", {
      duration: 5000,
      politeness: 'assertive',
      horizontalPosition: "center",
      verticalPosition: "bottom"
    });
  }

  dismiss(){
    this.matSnackBar.dismiss;
  }
}
