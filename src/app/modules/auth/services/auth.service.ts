import { ConfirmationComponent } from './../../../shared/dialogs/confirmation/confirmation.component';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, tap, switchMap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { environment } from './../../../../environments/environment';
import { User } from 'src/app/data/models/user';
import { HttpService } from './../../../shared/services/http.service';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user$: BehaviorSubject<any> = new BehaviorSubject(null);
  public redirectUrl: string = '';

  public confirmDialogRef: BsModalRef | undefined;

  get user(): Observable<any> {
    return this.user$.asObservable();
  }

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private httpClient: HttpClient,
      private http: HttpService,
      private modalService: BsModalService
    ) {
      let tok = localStorage.getItem(environment.AUTH_KEY);
      if(tok && this.isLoggedIn) {
        const decoded: any = helper.decodeToken(tok);
        this.http.setDatabase(decoded.deployment_key);
      }
    }

  get isLoggedIn(): boolean {
    const tok = localStorage.getItem(environment.AUTH_KEY);
    if(!tok) {
      return false;
    }

    return !helper.isTokenExpired(tok);
  }

  loadDatabases() {
    const { dbAPIPrefix } = environment;
    return this.httpClient.post(`${dbAPIPrefix}databases`, null);
  }

  setDatabaseName(db: string) {
    this.http.setDatabase(db);
  }

  login(cred: { username: string, password: string }): Observable<any> {
    const { dbAPIPrefix } = environment;
    const payload: URLSearchParams = new URLSearchParams();
    // payload.set('grant_type', 'password');
    payload.set('scope', `deployment_key:${this.http.getDatabase()}`);
    payload.set('username', cred.username);
    payload.set('password', cred.password);

    // return this.http.POST(`token`, payload.toString(), { "Content-Type": "application/x-www-form-urlencoded" })
    return this.httpClient.post(`${dbAPIPrefix}token`, payload.toString(), { headers: { "Content-Type": "application/x-www-form-urlencoded" }})
                          .pipe(
                            catchError((err: HttpErrorResponse) => of({ error: err.error, status: err.status })),
                            tap((res: any) => {
                              if(res && res.access_token) {
                                const decoded: any = helper.decodeToken(res.access_token);
                                this.handleAuth(decoded.firstName, decoded.lastName, decoded.username, res.access_token, decoded.expiresIn);
                                this.redirectUrl = this.route.snapshot.queryParams[`returnUrl`] || `/dashboard`;
                                this.router.navigate([this.redirectUrl]);
                              }
                            })
                          );
  }

  logout(force: boolean = false) {
    if(force) {
      this.doLogout();
      return;
    }
    const config = {
      title: `Confirm Logout`,
      message: `Are you sure you want to sign out?`,
      confirm: 'Yes Signout',
      cancel: 'Cancel'
    };
    this.confirmDialogRef = this.modalService.show(ConfirmationComponent, { initialState: config });
    this.confirmDialogRef.content.onClose.subscribe((result: boolean) => {
      if(result) {
        this.doLogout();
        window.location.reload();
      }
    });
  }

  private doLogout() {
    localStorage.removeItem(environment.AUTH_KEY);
    this.user$.next(null);
    this.router.navigate(['/login']);
  }

  requestPasswordReset() {}

  resetPassword() {}

  getUserInfo() {}

  private handleAuth(
      firstName: string,
      lastName: string,
      username: string,
      token: string,
      expiresIn: number
    ) {
      localStorage.setItem(environment.AUTH_KEY, token);
      const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
      const user= new User(firstName, lastName, username, token, expirationDate);
      this.user$.next(user);
    }

  private errorHandler(error: HttpErrorResponse) {
    console.log(error);
    throw new Error (error.message || "server error.");
  }
}
