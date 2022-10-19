import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../models/models.module';
import { environment } from 'src/environments/environment';
import { SharedService } from './shared.service';
import { Router } from '@angular/router';
import { SnackbarService } from './snackbar.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  fakeUsername: string = 'username';
  fakePassword: string = 'password';

  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private router: Router,
    private snackBarService: SnackbarService
  ) {}

  login(username: string | null, password: string | null): Observable<any> {
    let errorMessage = '';
    const headers = {
      'Content-Type': 'application/json',
      charset: 'utf8',
      Authorization: 'Basic ' + btoa(username + ':' + password),
    };
    let user = {} as IUser;
    user.username = username==null? '' : username;
    user.password = password==null? '' : password;

    this.http
      .post<IUser>(`${environment.apiUrl}/authenticate`, user, { headers })
      .subscribe({
        next: (data) => {
          // postId = data.id;
          console.log('user connecté : ' + data.id);
          this.sharedService.sendClickLoginEvent(data.id); // virer après l'authentification ?
          // localStorage.setItem("token", "my-super-secret-token-from-server");
          // localStorage.setItem('token', 'my-super-secret-token-from-server'); // virer ?
          // localStorage.setItem('current_user_login', username); // virer ?
          // localStorage.setItem('current_user_id', String(data.id)); // virer ?

          sessionStorage.setItem('username', username==null? '' : username);
          sessionStorage.setItem('current_user_id', String(data.id));
          sessionStorage.setItem('token', data.token);

          // this.isLogged = true;

          // this.isLoggedIn = true;
          // this.roles = this.tokenStorage.getUser().roles;
          // this.reloadPage();
          this.router.navigateByUrl('/');
          this.snackBarService.displayMessage("Authentification réussie.")
          
          return of(new HttpResponse({ status: 200 }));
          // this.sendClickPhraseEvent(postId)
          // return postId;
        },
        error: (error) => {
          errorMessage = error.message;
          console.error('There was an error!', error);
          this.snackBarService.displayMessage(
            "Impossible de s'identifier avec cet identifiant / mot de passe."
          );
          return of(new HttpResponse({ status: 401 }));
          // return null;
        },
      });

    return of(null);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/register`, {
      username,
      email,
      password
    });
  }


  logout(): void {
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('current_user_id')
  }

  isUserLoggedIn(): boolean {
    let user = sessionStorage.getItem('username');
    //console.log(!(user === null))
    return !(user === null);
  }
}


