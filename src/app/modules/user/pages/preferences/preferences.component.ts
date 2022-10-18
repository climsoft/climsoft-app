import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PreferencesDialogComponent } from './../../components/preferences-dialog/preferences-dialog.component';
import { take, delay } from 'rxjs/operators';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { UserService } from './../../services/user.service';

@Component({
  selector: 'app-preferences',
  templateUrl: './preferences.component.html',
  styleUrls: ['./preferences.component.scss']
})
export class PreferencesComponent implements OnInit {
  dialogRef: BsModalRef | undefined;

  constructor(private router: Router, private modalService: BsModalService, private userService: UserService) { }

  ngOnInit(): void {
    this.dialogRef?.hide();
    this.userService.state$.pipe(
        take(1),
        delay(500)
      ).subscribe((prof) => {
        const { preferences } = prof;
        const dialogConfig: ModalOptions = {
          initialState: { preferences },
          class: 'modal-sm',
          backdrop: 'static',
          keyboard: false
        };
        this.dialogRef = this.modalService.show(PreferencesDialogComponent, dialogConfig);
        this.dialogRef.content.onClose.subscribe((data: any) => {
          if(data) {
            this.userService.updatePreferences(data);
            this.router.navigate(['../profile']);
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.dialogRef?.hide();
  }
}
