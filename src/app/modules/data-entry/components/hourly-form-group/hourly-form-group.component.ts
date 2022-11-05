import { ElementLimits } from './../../../../data/interface/data-entry-form';
import { Flag } from './../../../../data/enum/flag';
import { filter, fromEvent } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';

const patternRegex = ``;

@Component({
  selector: 'app-hourly-form-group',
  templateUrl: './hourly-form-group.component.html',
  styleUrls: ['./hourly-form-group.component.scss']
})
export class HourlyFormGroupComponent implements OnInit, AfterViewInit {
  @ViewChild('inputValue') txtVal!: ElementRef;

  @Input() modified: boolean = false;
  @Input() limits!: ElementLimits | null;
  @Input() group: FormGroup = new FormGroup({
    hour:    new FormControl(1),
    value:  new FormControl(null, Validators.required),
    flag:   new FormControl(Flag.N)
  });
  @Input() disabled: boolean = false;
  @Output() onDirty: EventEmitter<boolean> = new EventEmitter;
  @Output() onRevert: EventEmitter<number> = new EventEmitter;
  @Output() onFocus: EventEmitter<number> = new EventEmitter;
  @Output() onBlur: EventEmitter<number> = new EventEmitter;
  @Output() onReturn: EventEmitter<number> = new EventEmitter;

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

  get fg() {
    return this.group.controls;
  }

  public get isDirty(): boolean {
    return this.fg['value'].dirty || this.fg['flag'].dirty;
  }

  public get isInvalid(): boolean {
    const val = this.fg['value'].value;

    if(val && !(/^\d+$/.test(val)))
      return true;

    if(this.limits && val) {
      return val < this.limits.lower || val > this.limits.upper;
    }

    return this.fg['value'].dirty && this.fg['value'].value !== '' && (this.fg['flag'].value === Flag.M);
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

  selectFlag(c: string) {
    this.group.controls['flag'].setValue(c);
  }

  focusValue() {
    this.txtVal.nativeElement.focus();
  }

  private onValRetunKey() {
    if(!this.fg['value'].value || +this.fg['value'].value === 0) {
      this.fg['flag'].setValue(Flag.M);
    }
    this.onReturn.emit(+this.fg['hour'].value);
  }

  onValueFocus() {
    this.hasFocus = true;
    this.onFocus.emit(this.fg['hour'].value);
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
    this.onBlur.emit(this.fg['hour'].value);
    this.valFocus = false;
  }

  public revert() {
    this.onRevert.emit(+this.fg['hour'].value);
  }
}
