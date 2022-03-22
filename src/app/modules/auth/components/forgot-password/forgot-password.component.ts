import { AppMode } from './../../../../data/enum/app-mode';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './../../services/auth.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
  });
  submitted = false;
  loading = false;
  error: boolean = false;

  constructor(private cookieService: CookieService, private authService: AuthService) {}


  ngOnInit(): void {}

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
}
