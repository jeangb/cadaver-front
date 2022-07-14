import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { tap } from "rxjs/operators";


@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthenticationService,
    private router: Router

  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (sessionStorage.getItem('username') && sessionStorage.getItem('token')) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer `+sessionStorage.getItem('token')}
      });
    }

    return next.handle(request).pipe(
      tap(
        (event) => {},
        (error) => {
          if (error instanceof HttpErrorResponse) {
            switch (error.status) {
              case 401:
                console.log('wrong login');
                break;
              case 403:
                this.authService.logout();
                this.router.navigateByUrl("/login");
                break;
              default:
                break;
            }
          }
        }
      )
    );
  }

}
