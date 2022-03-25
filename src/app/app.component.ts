import { take } from 'rxjs/operators';
import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser'
import {TranslateService} from '@ngx-translate/core';
import { IconSetService } from '@coreui/icons-angular';

import { UserService } from './modules/user/services/user.service';
import { ResponsiveService } from './shared/services/responsive.service';

import { iconSubset } from './icons/icon-subset';;
import { WiIconsService } from './shared/services/wi-icons.service';
import { AppMode } from './data/enum/app-mode';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'body',
  template: `
    <app-splash-screen [duration]="2" [animationDuration]="0.5"></app-splash-screen>
    <router-outlet></router-outlet>
  `,
})
export class AppComponent implements OnInit {
  title = 'Climsoft Weather App';
  /* @ts-ignore */
  favIcon: HTMLLinkElement = document.querySelector('#appIcon');

  @HostListener("window:resize", ['event'])
  private onResize(e: Event) {
    this.responsive.onResize(window.innerWidth);
  }

  constructor(
    private router: Router,
    private translate: TranslateService,
    private titleService: Title,
    private iconSetService: IconSetService,
    private wiIcons: WiIconsService,
    private responsive: ResponsiveService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.iconSetService.icons = { ...iconSubset };

    this.wiIcons.init();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });

    this.userService.state$.subscribe((user) => {
      this.translate.setDefaultLang(user.preferences.language);
      const isClimsoft = +user.preferences.mode === AppMode.CLIMSOFT;
      this.titleService.setTitle(isClimsoft ? 'Climsoft Weather App' : 'OpenCDMS Weather Data Management');
      this.favIcon.href = isClimsoft ? `./assets/climsoft.ico` : `/assets/opencdms.ico`;
    });
  }
}
