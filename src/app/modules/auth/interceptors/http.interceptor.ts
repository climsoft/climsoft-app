import { Router } from '@angular/router';
import { AuthService } from './../services/auth.service';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpUserEvent,
  HttpResponse,
  HttpProgressEvent,
  HttpHeaderResponse,
  HttpSentEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const whiteListUrls = ['login', 'refreshToken'];

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any> | any> {

    const isLoggedIn = this.authService.isLoggedIn;

    if (whiteListUrls.find(w => request.url.includes(w)) || !isLoggedIn) {
      return next.handle(request);
    }

    const token = localStorage.getItem(environment.AUTH_KEY);

    if(!token || !isLoggedIn) {
      // TODO: Implement Refresh Token Mechanism here.
      // REF: https://medium.com/deskera-engineering/handle-authentication-in-angular-8e18b7f55f2c

      return this.authService.logout(true) as any;
    }

    return next.handle(this.addTokenToRequest(request, token));
  }

  private addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
    // Token appended in the request header.
    return request.clone({ setHeaders: { Authorization: `Bearer ${token}`}});
  }
}

