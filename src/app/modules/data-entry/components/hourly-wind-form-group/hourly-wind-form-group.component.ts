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
  @Input() disabled: boolean = false;
  @Input() config!: { dd: number, ff: number };
  @Input() group: FormGroup = new FormGroup({
    hour: new FormControl(1),
    ddff: new FormControl(null, Validators.required),
    dd:   new FormControl(null, Validators.required),
    ff:   new FormControl(null, Validators.required),
    flag: new FormControl(Flag.N)
  });
  @Output() onDirty: EventEmitter<boolean> = new EventEmitter;
  @Output() onRevert: EventEmitter<number> = new EventEmitter;
  @Output() onFocus: EventEmitter<number> = new EventEmitter;
  @Output() onBlur: EventEmitter<number> = new EventEmitter;
  @Output() onReturn: EventEmitter<number> = new EventEmitter;

  ddffFocus = false;
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
        filter((e: KeyboardEvent) => e.keyCode === 13 && this.ddffFocus)
      )
      .subscribe((e) => {
        this.onValRetunKey();
      });
  }

  get ddffRegex(): any {
    if(this.config) {
      switch (this.config.dd + this.config.ff) {
        case 2: return /\b\d{2}\b/g;
        case 3: return /\b\d{3}\b/g;
        case 4: return /\b\d{4}\b/g;
        case 5: return /\b\d{5}\b/g;
        case 6: return /\b\d{6}\b/g;
        default: return /\b\d{6}\b/g;
      }
    }
  }

  get fg() {
    return this.group.controls;
  }

  public get isDirty(): boolean {
    return this.fg['ddff'].dirty || this.fg['flag'].dirty;
  }

  public get isInvalid(): boolean {
    return this.ddffInvalid || (this.fg['ddff'].dirty && this.fg['ddff'].value !== '' && this.fg['flag'].value === Flag.M);
  }

  public get ddffInvalid(): boolean {
    return this.fg['ddff'].dirty && this.fg['ddff'].value && !this.ddffRegex.test(this.fg['ddff'].value);
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
    if(this.fg['ddff'].value === '') {
      this.fg['flag'].setValue(Flag.M);
    }

    this.onReturn.emit(+this.fg['hour'].value);
  }

  onValFocus(field: string) {
    this.hasFocus = true;
    this.ddffFocus = true;
    this.onFocus.emit(this.fg['hour'].value);
  }

  onValBlur() {
    this.hasFocus = false;
    const val = this.fg['ddff'].value;

    // console.log(this.fg['ddff'].dirty && this.fg['ddff'].hasError('pattern'));

    if(val === '') {
      if(this.fg['flag'].value !== Flag.M) {
        this.selectFlag(Flag.M);
      }

      return;
    }

    if(val !== '' && this.fg['flag'].value === Flag.M) {
      this.selectFlag(Flag.N);
    }

    if(!this.ddffInvalid && +val) {
      const dd = val.slice(0, this.config.dd);
      const ff = val.slice(this.config.dd, (this.config.dd + this.config.ff));
      this.fg['dd'].setValue(dd);
      this.fg['ff'].setValue(ff);
      this.fg['ddff'].markAsPristine();
    }

    this.onBlur.emit(this.fg['hour'].value);
    this.ddffFocus = false;
  }

  public revert() {
    this.onRevert.emit(+this.fg['hour'].value);
  }
}

// TODO: Call the API for getting the digit sizes for DD and FF
// TODO: API: GET:https://api-latest.opencdms.org/climsoft/#/Reg%20Keys/get_reg_keys_v1_reg_keys_get
// TODO based on the keyvalue for each element type
