import { AuthService } from './../../../modules/auth/services/auth.service';
import { Component, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { User } from 'src/app/data/models/user';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {

  @Input() sidebarId: string = "sidebar";

  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)

  confirmation = false;
  public user: User = {};

  constructor(private classToggler: ClassToggleService, private authService: AuthService) {
    super();

    this.authService.user.subscribe(res => {
      this.user = res;
    });
  }

  logout() {
    // this.confirmation = true;
    this.authService.logout();
  }

  handleConfirmation(e: boolean) {
    console.log(e);
    // if(opt) {
    //   this.authService.logout();
    // }
  }

  toggleConfirm() {
    this.confirmation = !this.confirmation;
  }
}
