import { tap } from 'rxjs/operators';
import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Flag } from '@data/enum/flag';
import { filter, of, delay, Observable, fromEvent } from 'rxjs';

@Component({
  selector: 'app-daily-day-form-group',
  templateUrl: './daily-day-form-group.component.html',
  styleUrls: ['./daily-day-form-group.component.scss']
})
export class DailyDayFormGroupComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('inputValue') txtVal!: ElementRef;

  @Input() limits!: { lower: number, upper: number } | null;
  @Input() modified: boolean = false;
  @Input() group: FormGroup = new FormGroup({
    day:    new FormControl(1),
    value:  new FormControl(null, Validators.required),
    flag:   new FormControl(null),
    period: new FormControl(null)
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

  ngOnChanges(changes: SimpleChanges): void {
    if(this.disabled) {
      this.group.disable();
    } else {
      this.group.enable();
    }
  }

  ngAfterViewInit(): void {
    of(true).pipe(delay(500)).subscribe(() => {
      this.pristine = this.group.value;
    });

    fromEvent<KeyboardEvent>(this.ref.nativeElement, 'keyup')
      .pipe(
        filter((e: KeyboardEvent) => e.keyCode === 13 && this.valFocus)
      )
      .subscribe((e) => {
        this.onValRetunKey();
      });
  }

  selectFlag(f: string) {
    if(this.fg['flag'].value !== f) {
      this.fg['flag'].setValue(f);
      this.fg['flag'].markAsDirty();
    }
  }

  focusValue() {
    this.txtVal.nativeElement.focus();
  }

  private onValRetunKey() {
    if(!this.fg['value'].value || +this.fg['value'].value === 0) {
      this.fg['flag'].setValue(Flag.M);
    } else {
      console.log('111111');
      // TODO: Fix to be done
      this.fg['flag'].setValue(Flag.N);
    }
    this.onReturn.emit(+this.fg['day'].value);
  }

  onValueFocus() {
    this.hasFocus = true;
    this.onFocus.emit(this.fg['day'].value);
    this.valFocus = true;
  }

  onValueBlur(e: any) {
    this.hasFocus = false;
    const val = this.fg['value'].value;
    if(this.pristine.value === val && val !== '') {
      this.fg['value'].markAsPristine();
    }
    // console.log(val, this.fg['flag'].value);
    // console.log((val === null || val === '') && this.fg['flag'].value !== Flag.M);
    if((val === null || val === '') && this.fg['flag'].value !== Flag.M) {
      this.selectFlag(Flag.M);
    }
    // if(val !== null && this.fg['flag'].value === Flag.M) {
    //   this.selectFlag(Flag.N);
    // }
    this.onBlur.emit(this.fg['day'].value);
    this.valFocus = false;
  }

  get fg() {
    return this.group.controls;
  }

  public get isDirty(): boolean {
    return this.fg['value'].dirty || this.fg['flag'].dirty || this.fg['period'].dirty;
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

  public revert() {
    this.onRevert.emit(+this.fg['day'].value);
  }
}

// TODO: On all data entry forms:
// TODO: - 'empty' flag should be removed from legend and referred to as noFlag in code ...DONE
// TODO: - noFlag should be stored as NULL (or the empty string) in database ...DONE
// TODO: - In the flag selector, noFlag should be grey and M (Missing) should be red ...DONE
// TODO: - noFlag should not have a tool tip ???
// TODO: - New forms should initially have all flags set to noFlag ...DONE
// TODO: - After user selects a station/date, or after they submit/update and move to the next form, the first value field should have the focus ...DONE
// TODO: - On Enter Key press the focus should move to next value field ...DONE
// TODO: - If value was left empty when value field loses focus then a M/Missing flag should be automatically  ...DONE
// TODO: - If the users focuses on a value field with <No-Value & Missing Flag> and enters a value then the Missing flag should be automatically removed (set to noFlag) ???
