import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMessage = '';
  isLogged: boolean =false;

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(3)])
  });
  

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit(): void {
  }

  get usernameControl(): FormControl {
    return this.loginForm.get('username') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  login(): void {
    let username = this.loginForm.get('username')!.value;
    let password = this.loginForm.get('password')!.value;
    // this.authenticationService.login(username, password).subscribe(() => this.router.navigateByUrl("/")
    // , err => this.errorMessage = 'err.error.message');

    this.authenticationService.login(username, password);


    // this.authenticationService.login(username, password).subscribe(
    //   data => {
    //     // this.tokenStorage.saveToken(data.accessToken);
    //     // this.tokenStorage.saveUser(data);
    //     this.isLogged = true;
        
        
    //     // this.isLoggedIn = true;
    //     // this.roles = this.tokenStorage.getUser().roles;
    //     // this.reloadPage();
    //     this.router.navigateByUrl("/");
    //     // window.location.reload();
    //   }
      
    // );
  }

  cancel() : void{
    this.router.navigateByUrl("/");
  }

}
