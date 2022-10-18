import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-password-dialog',
  templateUrl: './password-dialog.component.html',
  styleUrls: ['./password-dialog.component.scss']
})
export class PasswordDialogComponent implements OnInit {

  public onClose: Subject<boolean> = new Subject();
  public form!: FormGroup;
  submitted = false;

  constructor(private router: Router, private dialogRef: BsModalRef) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      current: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirm:  new FormControl('', Validators.required)
    });
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

    // password update logic goes here.
    this.onClose.next(true);
    this.dialogRef.hide();
  }
}
