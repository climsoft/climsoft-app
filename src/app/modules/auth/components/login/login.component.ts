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
export class LoginComponent implements OnInit {
  form: FormGroup = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
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
  dbOptions: { key: string, value: string }[] = [];

  constructor(private cookieService: CookieService, private authService: AuthService) {
    console.log(AppConfig);
  }

  ngOnInit(): void {
      this.authService.loadDatabases().subscribe((dblist: any) => {
        Object.keys(dblist).forEach((key: string) => {
          this.dbOptions.push({ key, value: dblist[key] === 'empty-database' ? '' : dblist[key] });
        });
      });
  }

  get f() {
    return this.form.controls;
  }

  get isClimsoft(): boolean {
    return +this.cookieService.get(environment.APP_MODE_COOKIE) === AppMode.CLIMSOFT || false;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.f['db'].value);
    if(!this.f['db'].value || this.form.invalid) {
      return;
    }
    this.authService.setDatabaseName(this.f['db'].value);
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

  forgotPassword() {}
}
