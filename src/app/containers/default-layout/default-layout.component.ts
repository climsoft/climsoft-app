import { TranslateService } from '@ngx-translate/core';
import { UserService } from './../../modules/user/services/user.service';
import { Observable, tap, switchMap, delay } from 'rxjs';
import { Component, ViewChildren, QueryList, OnInit } from '@angular/core';

import { navItems, DefaultNavItems } from './_nav';
import { Colors } from 'src/app/data/enum/colors';

import { ToasterComponent, ToasterPlacement, INavData } from '@coreui/angular';
import { Toast, ToasterService } from 'src/app/modules/auth/services/toastr.service';
import { AppMode } from 'src/app/data/enum/app-mode';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss']
})
export class DefaultLayoutComponent implements OnInit {
  positions = Object.values(ToasterPlacement);
  position = ToasterPlacement.TopEnd;
  colors = Object.keys(Colors);
  autohide = true;
  delay = 5000;
  fade = true;
  @ViewChildren(ToasterComponent) viewChildren!: QueryList<ToasterComponent>;

  mode!: AppMode;
  toasts: Observable<Toast[]>;

  public navItems!: INavData[];

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(
    private translation: TranslateService,
    private toastService: ToasterService,
    private userService: UserService
  ) {
    this.toasts = this.toastService.toasts$;
  }

  get isClimsoft():boolean {
    if(this.mode) {
      return this.mode === AppMode.CLIMSOFT;
    }
    return false;
  }

  ngOnInit(): void {
    this.userService.state$
                      .pipe(delay(300))
                      .subscribe((pref) => this.renderNav());
  }

  private renderNav() {
    let navTrans: any;
    this.translation.get('nav').pipe(
        tap(nt => navTrans = nt),
        switchMap(() => this.userService.state$)
      )
      .subscribe((res) => {
        this.mode = +res.preferences.mode;
        let filteredNavItems: INavData[];
        if(+res.preferences.mode === AppMode.DEFAULT)
          filteredNavItems = navItems.filter(ni => !ni.title && (ni.name && DefaultNavItems.indexOf(ni.name?.toString()) !== -1));
        else {
          filteredNavItems = navItems;
        }
        this.translation.use(res.preferences.language);
        this.navItems = filteredNavItems.map((ni) => {
          if(ni.children && ni.children.length) {
            return {
              ...ni,
              name: navTrans[`${ni.name}`],
              children: ni.children.map((ch) => ({ ...ch, name: this.getNavProp(navTrans, ch.name) }))
            };
          } else {
            return { ...ni, name: this.getNavProp(navTrans, ni.name) };
          }
        });
      });
  }

  private getNavProp(trans: any, name?: string) {
    if(!name) {
      return 'Missing'
    }
    if(name.indexOf('.') === -1) {
      return trans[name];
    } else {
      const parr = name.split('.');
      if(parr.length === 2) {
        return trans[parr[0]][parr[1]];
      }
      if(parr.length === 3) {
        return trans[parr[0]][parr[1]][parr[2]];
      }
      if(parr.length === 4) {
        return trans[parr[0]][parr[1]][parr[2]][parr[3]];
      }
    }
  }
}
