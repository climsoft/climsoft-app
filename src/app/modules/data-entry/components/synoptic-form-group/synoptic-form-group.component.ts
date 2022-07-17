import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { filter } from 'rxjs';

import { Flag } from '@data/enum/flag';

@Component({
  selector: 'app-synoptic-form-group',
  templateUrl: './synoptic-form-group.component.html',
  styleUrls: ['./synoptic-form-group.component.scss']
})
export class SynopticFormGroupComponent implements OnInit {
  @Input() modified: boolean = false;
  @Input() group: FormGroup = new FormGroup({
    key:    new FormControl(''),
    label:  new FormControl(''),
    value:  new FormControl(null, Validators.required),
    flag:   new FormControl(null)
  });
  @Input() disabled: boolean = false;
  @Output() onDirty: EventEmitter<boolean> = new EventEmitter;
  @Output() onRevert: EventEmitter<number> = new EventEmitter;

  pristine: any;

  constructor() { }

  ngOnInit(): void {
    this.group.valueChanges.pipe(
      filter((val) => !this.modified)
    ).subscribe((val) => {
      this.onDirty.emit(true);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.disabled) {
      this.group.disable();
    } else {
      this.group.enable();
    }
  }

  selectFlag(f: string) {
    this.group.controls['flag'].setValue(f);
  }

  onBlur(e: any) {
    if(this.pristine.value === this.fg['value'].value) {
      this.fg['value'].markAsPristine();
    }
  }

  get fg() {
    return this.group.controls;
  }

  public get isDirty(): boolean {
    return this.fg['value'].dirty || this.fg['flag'].dirty || this.fg['period'].dirty;
  }

  public get isInvalid(): boolean {
    return this.fg['value'].dirty && this.fg['value'].value && (this.fg['flag'].value === Flag.M);
  }

  public revert() {
    this.onRevert.emit(+this.fg['day'].value);
  }
}
