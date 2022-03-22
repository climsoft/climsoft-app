import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { UserService } from './../../services/user.service';
import { ProfileDialogComponent } from './../../components/profile-dialog/profile-dialog.component';
import { of, delay } from 'rxjs';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-update-profile',
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit, OnDestroy {
  dialogRef: BsModalRef | undefined;

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private userService: UserService) { }

  ngOnInit(): void {
    this.dialogRef?.hide();
    this.userService.state$.pipe(
        take(1),
        delay(500)
      ).subscribe((prof) => {
        const { profile } = prof;
        const dialogConfig: ModalOptions = {
          initialState: { profile },
          class: 'modal-sm',
          backdrop: 'static',
          keyboard: false
        };
        this.dialogRef = this.modalService.show(ProfileDialogComponent, dialogConfig);
        this.dialogRef.content.onClose.subscribe((data: any) => {
          if(data) {
            this.userService.updateProfile(data);
            this.router.navigate(['../profile']);
          }
        });
      });
  }

  ngOnDestroy(): void {
    this.dialogRef?.hide();
  }
}
