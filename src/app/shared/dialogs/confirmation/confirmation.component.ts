import { Component, OnInit, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  @Input() title: string = 'Confirm Action';
  @Input() message: string = 'Are you sure you want to perform this action';
  @Input() confirm: string = 'Ok';
  @Input() cancel: string = 'Cancel';

  public onClose: Subject<boolean> = new Subject();

  constructor(private dialogRef: BsModalRef) { }

  ngOnInit(): void {}

  public onConfirm(): void {
    this.onClose.next(true);
    this.dialogRef.hide();
  }

  public onCancel(): void {
      this.onClose.next(false);
      this.dialogRef.hide();
  }
}
