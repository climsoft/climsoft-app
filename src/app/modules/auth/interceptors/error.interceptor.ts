import { AuthService } from './../services/auth.service';
import { NavigationExtras, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { ToasterService } from '../services/toastr.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToasterService, private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if(err) {
          switch (err.error.status) {
            case 400:
              console.error(err.error);
              this.toastr.add('error', 'Invalid Request', 'Request rejected');
              break;

            case 401:
              // this.toastr.add('warning', 'Unauthorized', 'Session Expired, Please login');
              this.authService.logout(true);
              break;

            case 404:
              this.router.navigateByUrl('/not-found');
              break;

            case 500:
              const navigationExtras: NavigationExtras = {
                state: { error: err.error },
              };
              this.toastr.add('error', 'Error', 'Error loading request');
              // this.router.navigateByUrl('/server-error', navigationExtras);
              break;

            default:
              console.error(err.error);
              this.toastr.add('error', 'Error', 'Error loading request');
              break;
          }
        }

        return throwError(err);
      })
    );
  }
}
11
