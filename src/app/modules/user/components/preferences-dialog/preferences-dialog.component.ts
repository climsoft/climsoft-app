import { getLocales } from './../../../../data/enum/app.locale';
import { Modes } from './../../../../data/enum/app-mode';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserPreferences } from './../../../../data/interface/user';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-preferences-dialog',
  templateUrl: './preferences-dialog.component.html',
  styleUrls: ['./preferences-dialog.component.scss']
})
export class PreferencesDialogComponent implements OnInit {
  @Input() preferences!: UserPreferences;

  public onClose: Subject<boolean> = new Subject();
  public form!: FormGroup;
  submitted = false;

  modes = Modes.map((m, i) => ({ key: i, value: m }));
  locales!: any;


  constructor(private router: Router, private dialogRef: BsModalRef) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      mode: new FormControl('', Validators.required),
      locale: new FormControl('', Validators.required),
      language: new FormControl('', Validators.required)
    });

    this.locales = getLocales();
    console.log(this.locales);
    console.log(this.preferences);
    this.form.patchValue(this.preferences);
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
