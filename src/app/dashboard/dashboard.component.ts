import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogContent} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IUser } from '../models/models.module';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  userLogin: string|null;
  user = {} as IUser;
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog)
     {
      let jsonUser=sessionStorage.getItem('current_user');
      if (null!=jsonUser){
        this.user=JSON.parse(jsonUser);
      }
      this.userLogin=sessionStorage.getItem("username");
      

    }

  ngOnInit(): void {
  }

  login(): void {
    this.router.navigateByUrl("/login");
  }

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }

  register(): void {
    this.authService.logout();
    this.router.navigateByUrl("/register");
  }
  
  openHelpDialog(): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    // dialogRef.afterClosed().subscribe((result: any) => {
    //   console.log(`Dialog result: ${result}`);
    // });
  }
}

@Component({
  selector: 'dialog-help-content',
  templateUrl: 'dialog-help-content.html',
})
export class DialogContentExampleDialog {}