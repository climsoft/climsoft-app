import { Observable } from 'rxjs';
import { Component, ViewChildren, QueryList } from '@angular/core';

import { navItems } from './_nav';
import { Colors } from 'src/app/data/enum/colors';

import { ToasterComponent, ToasterPlacement } from '@coreui/angular';
import { Toast, ToasterService } from 'src/app/modules/auth/services/toastr.service';


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

  toasts: Observable<Toast[]>;

  public navItems = navItems;

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(private toastService: ToasterService) {
    this.toasts = this.toastService.toasts$;
  }
}
