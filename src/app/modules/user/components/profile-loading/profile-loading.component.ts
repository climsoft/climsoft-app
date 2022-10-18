import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { UserProfile } from './../../../../data/interface/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-profile-loading',
  templateUrl: './profile-loading.component.html',
  styleUrls: ['./profile-loading.component.scss']
})
export class ProfileLoadingComponent implements OnInit {
  @Input() profile!: UserProfile;

  public onClose: Subject<boolean> = new Subject();

  constructor(private dialogRef: BsModalRef) { }

  ngOnInit(): void {
  }

  onCancel() {
    this.onClose.next(false);
    this.dialogRef.hide();
  }
}
