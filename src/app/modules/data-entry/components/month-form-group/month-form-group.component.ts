import { filter } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { Flag } from '@data/enum/flag';
import * as moment from 'moment';
import { ElementLimits } from '@data/interface/data-entry-form';

@Component({
  selector: 'app-month-form-group',
  templateUrl: './month-form-group.component.html',
  styleUrls: ['./month-form-group.component.scss']
})
export class MonthFormGroupComponent implements OnInit, AfterViewInit {
  @ViewChild('inputValue') txtVal!: ElementRef;

  @Input() modified: boolean = false;
  @Input() limits!: ElementLimits | null;
  @Input() group: FormGroup = new FormGroup({
    month:  new FormControl(''),
    value:  new FormControl(null),
    flag:   new FormControl(null),
    priod:  new FormControl(''),
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
      console.log(val);
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

  public get isDirty(): boolean {
    return this.fg['value'].dirty || this.fg['flag'].dirty || this.fg['period'].dirty;
  }

  public get isInvalid(): boolean {
    const val = this.fg['value'].value;

    if(val) {
      if(!(/^\d+$/.test(val))) {
        return true;
      }

      if(this.limits) {
        return +val < this.limits.lower || +val > this.limits.upper;
      }
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

  monthVal(n: number): string {
    if(n && n < 10) {
      return `0${n}`;
    }
    return `${n}`;
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

  private onValRetunKey() {
    if(!this.fg['value'].value || +this.fg['value'].value === 0) {
      this.fg['flag'].setValue(Flag.M);
    }
    const mon = +moment().month(this.fg['month'].value).format("M");
    this.onReturn.emit(+mon);
  }

  onValueFocus() {
    this.hasFocus = true;
    this.onFocus.emit(this.fg['month'].value);
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
    this.onBlur.emit(this.fg['month'].value);
    this.valFocus = false;
  }

  public revert() {
    const mon = +moment().month(this.fg['month'].value).format("M");
    this.onRevert.emit(mon);
  }
}
