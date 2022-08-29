import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Flag } from '@data/enum/flag';
import { filter, fromEvent } from 'rxjs';

@Component({
  selector: 'app-hourly-wind-form-group',
  templateUrl: './hourly-wind-form-group.component.html',
  styleUrls: ['./hourly-wind-form-group.component.scss']
})
export class HourlyWindFormGroupComponent implements OnInit, AfterViewInit {
  @ViewChild('ddffValue') ddffValue!: ElementRef;
  @ViewChild('ddValue') ddValue!: ElementRef;
  @ViewChild('ffValue') ffValue!: ElementRef;

  @Input() modified: boolean = false;
  @Input() group: FormGroup = new FormGroup({
    hour: new FormControl(1),
    ddff: new FormControl(null, Validators.required),
    dd:   new FormControl(null, Validators.required),
    ff:   new FormControl(null, Validators.required),
    flag: new FormControl(null)
  });
  @Input() disabled: boolean = false;
  @Output() onDirty: EventEmitter<boolean> = new EventEmitter;
  @Output() onRevert: EventEmitter<number> = new EventEmitter;
  @Output() onFocus: EventEmitter<number> = new EventEmitter;
  @Output() onBlur: EventEmitter<number> = new EventEmitter;
  @Output() onReturn: EventEmitter<number> = new EventEmitter;

  ddffFocus = false;
  ddFocus = false;
  ffFocus = false;
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

  ngOnChanges(changes: SimpleChanges): void {
    if(this.disabled) {
      this.group.disable();
    } else {
      this.group.enable();
    }
  }

  ngAfterViewInit(): void {
    fromEvent<KeyboardEvent>(this.ref.nativeElement, 'keyup')
      .pipe(
        filter((e: KeyboardEvent) => e.keyCode === 13 && (this.ddffFocus || this.ddFocus || this.ffFocus))
      )
      .subscribe((e) => {
        this.onValRetunKey();
      });
  }

  get fg() {
    return this.group.controls;
  }

  public get isDirty(): boolean {
    return this.fg['ddff'].dirty || this.fg['dd'].dirty || this.fg['ff'].dirty || this.fg['flag'].dirty;
  }

  public get isInvalid(): boolean {
    return this.fg['ddff'].dirty && this.fg['ddff'].value !== '' && (this.fg['ddff'].value === Flag.M);
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

  hourVal(n: number): string {
    if(!n) {
      return '00';
    }
    if(n && n < 10) {
      return `0${n}`;
    }
    return `${n}`;
  }

  focusValue() {
    this.ddffValue.nativeElement.focus();
  }

  selectFlag(c: string) {
    this.group.controls['flag'].setValue(c);
  }

  private onValRetunKey() {
    if(this.ffFocus) {
      this.onReturn.emit(+this.fg['hour'].value);
    }
    if(this.ddFocus) {
      this.ffValue.nativeElement.focus();
    }
    if(this.ddffFocus) {
      this.ddValue.nativeElement.focus();
    }

    if(this.fg['ddff'].value === '' && this.fg['dd'].value === '' && this.fg['ff'].value === '') {
      this.fg['flag'].setValue(Flag.M);
    }
  }

  onValFocus(field: string) {
    this.ddffFocus = false;
    this.ddFocus = false;
    this.ffFocus = false;

    this.hasFocus = true;
    this.onFocus.emit(this.fg['hour'].value);
    switch (field) {
      case 'ddff': this.ddffFocus = true; break;
      case 'dd': this.ddFocus = true; break;
      case 'ff': this.ffFocus = true; break;
    }
  }

  onValBlur(e: any) {
    this.hasFocus = false;
    const val = this.fg['ddff'].value;
    if(this.pristine && this.pristine.value === val && val !== '') {
      this.fg['ddff'].markAsPristine();
    }
    if(val === '' && this.fg['flag'].value !== Flag.M) {
      this.selectFlag(Flag.M);
    }
    if(val !== '' && this.fg['flag'].value === Flag.M) {
      this.selectFlag(Flag.N);
    }
    this.onBlur.emit(this.fg['hour'].value);
    this.ddffFocus = false;
    this.ddFocus = false;
    this.ffFocus = false;
  }

  public revert() {
    this.onRevert.emit(+this.fg['hour'].value);
  }
}
