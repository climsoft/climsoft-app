import { Component, OnInit } from '@angular/core';

import { AppMode } from './../../../../data/enum/app-mode';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import AppConfig from '@config/app-config.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form: FormGroup = new FormGroup({
    username: new FormControl('admin', Validators.required),
    password: new FormControl('password123', Validators.required),
    api: new FormControl('api-latest'),
    db: new FormControl('')
  });
  submitted = false;
  loading = false;
  error: boolean = false;

  mode!: AppMode;

  apiOptions = [
    { key: 'API openCDMS', value: 'api-opencdms' },
    { key: 'API Latest', value: 'api-latest' },
    { key: 'API Test', value: 'api-test' }
  ];
  dbOptions = [
    { key: 'openCDMS DB 1', value: 'opencdms-db-1' },
    { key: 'openCDMS DB 2', value: 'opencdms-db-2' },
    { key: 'Test Database', value: 'test_db' },
    { key: 'Climsoft DB 1', value: 'climsoft-db-1' },
    { key: 'Climsoft DB 2', value: 'climsoft-db-2' }
  ];

  constructor(private cookieService: CookieService, private authService: AuthService) {
    console.log(AppConfig);
  }

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
    const payload = { ...this.form.value };
    delete payload.api;
    delete payload.db;
    this.authService.login(payload)
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
