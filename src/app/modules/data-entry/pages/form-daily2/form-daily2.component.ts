import { ResponsiveService } from './../../../../shared/services/responsive.service';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { UnitOptions } from './../../../../data/enum/units';
import { Station } from 'src/app/data/interface/station';
import { ObsElement } from 'src/app/data/interface/element';

import * as moment from 'moment';

@Component({
  selector: 'app-form-daily2',
  templateUrl: './form-daily2.component.html',
  styleUrls: ['./form-daily2.component.scss']
})
export class FormDaily2Component implements OnInit {
  form!: FormGroup;
  submitted = false;
  loading = false;
  error = '';

  station!: Station | undefined;
  element!: ObsElement | undefined;

  bsValue!: Date;
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'MM/YYYY'
  };
  year!: number;
  month!: number;
  hour!: number;

  unitOptions = UnitOptions;
  hoursList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

  constructor(private responsiveSvc: ResponsiveService) {}

  ngOnInit(): void {
    this.initForm();
    // console.log(MediaQueryListEvent);
    this.responsiveSvc.screenSize.subscribe(x => {
      console.log(x);
      // this.size = x;
    });
  }

  get f() {
    return this.form.controls;
  }

  resetStation() {
    this.element = undefined;
    this.form.controls['station'].reset();
  }

  onStationSelect(data: Station) {
    this.station = data;
    this.form.controls['station'].setValue(data.station_id);
  }

  resetElement() {
    this.element = undefined;
    this.form.controls['element'].reset();
  }

  onElementSelect(data: ObsElement) {
    this.element = data;
    this.form.controls['element'].setValue(data.element_id);
  }

  onSubmit(e: Event) {
    this.submitted = true;

    // if(this.form.invalid) {
    //   return false;
    // }
    const formVal = this.form.value;
    formVal.days = this.formDaysGroups.map(fg => fg.value);
    console.log(formVal);

    // API implementation goes here.
    return true;
  }

  onDateSelection(data: Date) {
    if(data) {
      this.renderFormDays(data);
    }
  }

  getHoursValue(h: number) {
    const tempDate = moment().set('hours', h).startOf('hour');
    return tempDate.format('HH:mm');
  }

  onReset() {
    this.form.reset();
    this.initForm();
  }

  onCancel() {}

  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
  }

  onHourSelect(data: any) {
    console.log(data.target.value);
  }

  getDateText(y: number, m: number) {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return `${months[m-1]} ${y}`;
  }

  get daysArray(): FormArray {
    return this.form.get('days') as FormArray;
  }

  get formDaysGroups(): FormGroup[] {
    return this.daysArray.controls as FormGroup[];
  }

  private resetDays() {
    this.form.controls['days'] = new FormArray([]);
  }

  private getDayGroup(day: number, value?: number, flag?: string, period?: number): FormGroup {
    return new FormGroup({
      day:    new FormControl(day),
      value:  new FormControl(value, [Validators.min(0), Validators.max(70)]),
      flag:   new FormControl(flag),
      period: new FormControl(period)
    });
  }

  private renderFormDays(date: Date) {
    let selDate = moment(date);
    this.year = selDate.year();
    this.month = selDate.month() + 1;
    const days = moment(`${this.year}-${this.month}`, "YYYY-MM").daysInMonth();
    this.resetDays();
    for(let i=1; i <= days; i++) {
      this.daysArray.push(this.getDayGroup(i));
    }
  }

  private initForm() {
    this.form = new FormGroup({
      station:        new FormControl(null, Validators.required),
      element:        new FormControl(null, Validators.required),
      element_seq:    new FormControl(false),
      monthYear:      new FormControl(new Date(), Validators.required),
      dayHour:        new FormControl(6, [Validators.min(0), Validators.max(24)]),
      temperature:    new FormControl('', Validators.required),
      precip:         new FormControl('', Validators.required),
      cloud_height:   new FormControl('', Validators.required),
      visibility:     new FormControl('', Validators.required),
      days:           new FormArray([]),
      total:          new FormControl(null)
    });
  }
}
