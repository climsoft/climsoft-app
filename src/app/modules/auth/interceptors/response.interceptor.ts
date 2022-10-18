import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ToasterService } from '../services/toastr.service';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(private toastr: ToasterService, private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const hasToast: boolean = ['POST', 'PUT', 'DELETE'].includes(request.method);
    return next.handle(request).pipe(
      tap((e: HttpEvent<any>) => {
        if(e instanceof HttpResponse) {
          if(hasToast && e.body && e.body.status === 'success') {
            this.toastr.add('success', 'Success', e.body.message || 'Operation Successful');
          }
        }
      })
    );
  }
}
