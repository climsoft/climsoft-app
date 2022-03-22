import { AppMode } from './../../../../data/enum/app-mode';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { catchError, Subject, Observable, of } from 'rxjs';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl('admin', Validators.required),
    password: new FormControl('password123', Validators.required)
  });
  submitted = false;
  loading = false;
  error: boolean = false;

  mode!: AppMode;

  constructor(private cookieService: CookieService, private authService: AuthService) {}

  get f() {
    return this.form.controls;
  }

  get isClimsoft(): boolean {
    return +this.cookieService.get(environment.APP_MODE_COOKIE) === AppMode.CLIMSOFT || false;
  }

  onSubmit() {
    this.submitted = true;
    if(this.form.invalid) {
      return;
    }
    this.loading = true;
    this.authService.login(this.form.value)
        .subscribe({
          next: (res: any) => {
            if([400, 401, 403].indexOf(res.status) !== -1) {
              this.error = true;
            } else {
              this.error = false;
              this.submitted = false;
            }
            this.loading = false;
          }
        });
  }

  forgotPassword() {

  }
}
