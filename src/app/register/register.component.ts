import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const { username, email, password } = this.form;
    const observer = {
      next: (x: any) => {
        console.log(x);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error;
        this.isSignUpFailed = true;
      }
    };
    this.authenticationService.register(username, email, password)
    .subscribe(observer);
  }

  login(): void{
    this.router.navigateByUrl('/login');
  }

  cancel() : void{
    this.router.navigateByUrl("/");
  }


}
