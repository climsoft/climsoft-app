import { UserProfile } from './../../../../data/interface/user';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

@Component({
  selector: 'app-profile-dialog',
  templateUrl: './profile-dialog.component.html',
  styleUrls: ['./profile-dialog.component.scss']
})
export class ProfileDialogComponent implements OnInit {
  @Input() profile!: UserProfile;

  public onClose: Subject<boolean> = new Subject();
  public form!: FormGroup;
  submitted = false;

  constructor(private router: Router, private dialogRef: BsModalRef) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.pattern(emailPattern)]),
      userId:  new FormControl('', Validators.required)
    });

    this.form.patchValue(this.profile);
  }

  get f(): any {
    return this.form.controls;
  }

  onCancel() {
    this.onClose.next(false);
    this.dialogRef.hide();
  }

  onSubmit(e: any): any {
    this.submitted = true;
    if(this.form.invalid) {
      return false;
    }
    this.onClose.next(this.form.value);
    this.dialogRef.hide();
  }
}
