import { ScreenSize, ScreenSizes } from './data/enum/screen-size';
import { ResponsiveService } from './shared/services/responsive.service';
import { Component, OnInit, ElementRef, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { IconSetService } from '@coreui/icons-angular';
import { iconSubset } from './icons/icon-subset';
import { Title } from '@angular/platform-browser';
import { WiIconsService } from './shared/services/wi-icons.service';

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

  @HostListener("window:resize", ['event'])
  private onResize(e: Event) {
    this.responsive.onResize(window.innerWidth);
  }

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private titleService: Title,
    private iconSetService: IconSetService,
    private wiIcons: WiIconsService,
    private responsive: ResponsiveService
  ) {
    titleService.setTitle(this.title);
    // iconSet singleton
    iconSetService.icons = { ...iconSubset };
  }

  ngOnInit(): void {
    this.wiIcons.init();
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
    });
  }
}
