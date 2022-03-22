import { UserService } from './../../modules/user/services/user.service';
import { Observable } from 'rxjs';
import { Component, ViewChildren, QueryList } from '@angular/core';

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
export class DefaultLayoutComponent {
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

  constructor(private toastService: ToasterService, private userService: UserService) {
    this.toasts = this.toastService.toasts$;
    this.userService.state$.subscribe((res) => {
      this.mode = +res.preferences.mode;
      if(+res.preferences.mode === AppMode.DEFAULT)
        this.navItems = navItems.filter(ni => !ni.title && (ni.name && DefaultNavItems.indexOf(ni.name?.toString()) !== -1));
      else {
        this.navItems = navItems;
      }
    });
  }

  get isClimsoft():boolean {
    if(this.mode) {
      return this.mode === AppMode.CLIMSOFT;
    }
    return false;
  }
}
