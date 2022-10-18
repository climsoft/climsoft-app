import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { filter, fromEvent } from 'rxjs';

import { Flag } from '@data/enum/flag';

@Component({
  selector: 'app-synoptic-form-group',
  templateUrl: './synoptic-form-group.component.html',
  styleUrls: ['./synoptic-form-group.component.scss']
})
export class SynopticFormGroupComponent implements OnInit, AfterViewInit {
  @Input() modified: boolean = false;
  @Input() group: FormGroup = new FormGroup({
    index:  new FormControl(0),
    element: new FormControl(0),
    key:    new FormControl(''),
    label:  new FormControl(''),
    value:  new FormControl(null, Validators.required),
    flag:   new FormControl(null)
  });
  @Input() disabled: boolean = false;
  @Output() onDirty: EventEmitter<boolean> = new EventEmitter;
  @Output() onRevert: EventEmitter<number> = new EventEmitter;
  @Output() onFocus: EventEmitter<number> = new EventEmitter;
  @Output() onBlur: EventEmitter<number> = new EventEmitter;
  @Output() onReturn: EventEmitter<number> = new EventEmitter;

  @ViewChild('inputValue') txtVal!: ElementRef;

  valFocus = false;
  pristine: any;
  hasFocus = false;

  constructor(private ref: ElementRef) { }

  ngOnInit(): void {
    this.group.valueChanges.pipe(
      filter((val) => !this.modified)
    ).subscribe((val) => {
      this.onDirty.emit(true);
    });
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(this.ref.nativeElement, 'keyup')
      .pipe(
        filter((e: KeyboardEvent) => e.keyCode === 13 && this.valFocus)
      )
      .subscribe((e) => {
        this.onValRetunKey();
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

  focusValue() {
    this.txtVal.nativeElement.focus();
  }

  get fg() {
    return this.group.controls;
  }

  public get isDirty(): boolean {
    return this.fg['value'].dirty || this.fg['flag'].dirty;
  }

  public get isInvalid(): boolean {
    return this.fg['value'].dirty && this.fg['value'].value && (this.fg['flag'].value === Flag.M);
  }

  public get styles(): any {
    const styles: any = { 'has-focus': this.hasFocus };
    if(this.isDirty) {
      styles['is-dirty'] = true;
    }
    if(this.isInvalid) {
      styles['is-dirty'] = false;
      styles['is-invalid'] = true;
    }

    return styles;
  }

  private onValRetunKey() {
    if(!this.fg['value'].value || +this.fg['value'].value === 0) {
      this.fg['flag'].setValue(Flag.M);
    }
    this.onReturn.emit(+this.fg['index'].value);
  }

  onValueFocus() {
    this.hasFocus = true;
    this.onFocus.emit(this.fg['key'].value);
    this.valFocus = true;
  }

  onValueBlur(e: any) {
    this.hasFocus = false;
    const val = this.fg['value'].value;
    if(this.pristine && this.pristine.value === val && val !== '') {
      this.fg['value'].markAsPristine();
    }
    if(val === '' && this.fg['flag'].value !== Flag.M) {
      this.selectFlag(Flag.M);
    }
    if(val !== '' && this.fg['flag'].value === Flag.M) {
      this.selectFlag(Flag.N);
    }
    this.onBlur.emit(this.fg['key'].value);
    this.valFocus = false;
  }

  public revert() {
    this.onRevert.emit(+this.fg['index'].value);
  }
}
