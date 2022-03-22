import { of, delay } from 'rxjs';
import { PasswordDialogComponent } from './../../components/password-dialog/password-dialog.component';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit, AfterViewInit, OnDestroy {
  dialogRef: BsModalRef | undefined;

  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const dialogConfig: ModalOptions = {
      initialState: {},
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    };
    of(true).pipe(delay(1000)).subscribe(() => {
      this.dialogRef = this.modalService.show(PasswordDialogComponent, dialogConfig);
      this.dialogRef.content.onClose.subscribe((opt: boolean) => {
        if(opt) {
          // this.stationService.removeStation(st.station_id);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.dialogRef?.hide();
  }
}
