import { Component, OnInit } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { ResponsiveService } from '@shared/services/responsive.service';
import { ObsElement } from '@data/interface/element';
import { Station } from '@data/interface/station';
import { HourlyRecord } from '@data/interface/data-entry-form';
import { IDataEntryForm } from '@data/interface/data-entry-form';

import * as moment from 'moment';
import { Flag } from '@data/enum/flag';

@Component({
  selector: 'app-form-hourly',
  templateUrl: './form-hourly.component.html',
  styleUrls: ['./form-hourly.component.scss']
})
export class FormHourlyComponent implements OnInit, IDataEntryForm {
  form!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  monthModified: boolean = false;

  station!: Station | undefined;
  element!: ObsElement | undefined;

  monthYearValue: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'DD/MM/YYYY'
  };
  date!: Date;

  hoursList = [24, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

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

  get isEditable(): boolean {
    return !!this.station && !!this.element;
  }

  get isModified(): boolean {
    return this.monthModified;
  }

  onFormModified(val: boolean) {
    this.monthModified = val;
  }

  resetStation() {
    this.station = undefined;
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
    formVal.hours = this.formHoursGroups.map(fg => fg.value);
    console.log(formVal);

    // API implementation goes here.
    return true;
  }

  onDateSelection(data: Date) {
    if(data) {
      this.renderFormHours(data);
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

  getDateText() {
    return moment(this.date).format('DD MMM YYYYY');
  }

  get hoursArray(): FormArray {
    return this.form.get('hours') as FormArray;
  }

  get formHoursGroups(): FormGroup[] {
    return this.hoursArray.controls as FormGroup[];
  }

  private getHourGroup(data: HourlyRecord): FormGroup {
    const formGroup = new FormGroup({
      hour:    new FormControl(null),
      value:  new FormControl(null, [Validators.min(0), Validators.max(70)]),
      flag:   new FormControl(null)
    });

    if(data) {
      formGroup.patchValue(data);
    }

    return formGroup;
  }

  private renderFormHours(date: Date) {
    this.resetHours();
    for(let i=0; i <= this.hoursList.length; i++) {
      this.hoursArray.push(this.getHourGroup({ hour: i, value: 0, flag: Flag.M }));
    }
  }

  private resetHours() {
    this.form.controls['days'] = new FormArray([]);
  }

  private initForm() {
    this.form = new FormGroup({
      station:        new FormControl(null, Validators.required),
      element:        new FormControl(null, Validators.required),
      date:           new FormControl(new Date(), Validators.required),
      hours:          new FormArray([]),
      total:          new FormControl(null)
    });
  }

}
