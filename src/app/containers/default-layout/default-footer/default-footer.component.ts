import { AppMode } from './../../../data/enum/app-mode';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { Component } from '@angular/core';
import { FooterComponent } from '@coreui/angular';

@Component({
  selector: 'app-default-footer',
  templateUrl: './default-footer.component.html',
  styleUrls: ['./default-footer.component.scss'],
})
export class DefaultFooterComponent extends FooterComponent {
  constructor(private cookieService: CookieService) {
    super();
  }

  get isClimsoft(): boolean {
    return +this.cookieService.get(environment.APP_MODE_COOKIE) === AppMode.CLIMSOFT || false;
  }

  getCopyright() {
    const year = (new Date()).getFullYear();
    return `${year} ${this.isClimsoft ? 'Climsoft' : 'OpenCDMS'}`;
  }
}
