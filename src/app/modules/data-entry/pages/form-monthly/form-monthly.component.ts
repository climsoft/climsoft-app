import { MonthlyRecord } from './../../../../data/interface/data-entry-form';
import { ResponsiveService } from '@shared/services/responsive.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { Flag } from '@data/enum/flag';
import { ObsElement } from '@data/interface/element';
import { Station } from '@data/interface/station';
import * as moment from 'moment';


@Component({
  selector: 'app-form-monthly',
  templateUrl: './form-monthly.component.html',
  styleUrls: ['./form-monthly.component.scss']
})
export class FormMonthlyComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  monthModified: boolean = false;

  station!: Station | undefined;
  element!: ObsElement | undefined;

  yearValue: number = new Date().getFullYear();
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'YYYY'
  };
  date!: Date;
  monthsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  constructor(private responsiveSvc: ResponsiveService) {}

  ngOnInit(): void {
    this.initForm();
    // console.log(MediaQueryListEvent);
    this.responsiveSvc.screenSize.subscribe(x => {
      console.log(x);
      // this.size = x;
    });

    this.renderFormMonths(this.yearValue);
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
    formVal.hours = this.formMonthGroups.map(fg => fg.value);
    console.log(formVal);

    // API implementation goes here.
    return true;
  }

  yearSelect(e: any) {
    this.renderFormMonths(e);
  }

  onReset() {
    this.form.reset();
    this.initForm();
  }

  onCancel() {}

  getDateText() {
    return moment(this.date).format('YYYY');
  }

  get monthsArray(): FormArray {
    return this.form.get('months') as FormArray;
  }

  get formMonthGroups(): FormGroup[] {
    return this.monthsArray.controls as FormGroup[];
  }

  private getMonthGroup(data: MonthlyRecord): FormGroup {
    const formGroup = new FormGroup({
      month:  new FormControl(null),
      value:  new FormControl(null, [Validators.min(0), Validators.max(70)]),
      flag:   new FormControl(null),
      period: new FormControl(null)
    });

    if(data) {
      formGroup.patchValue(data);
    }

    return formGroup;
  }

  private renderFormMonths(yearVal: number) {
    let selDate = moment(`${yearVal}`);
    const year = selDate.year();
    this.resetMonths();
    for(let i=0; i <= this.monthsList.length; i++) {
      const period = moment(`${year}-${this.monthsList[i]}`, "YYYY-MM").daysInMonth();
      const monthText = moment(`${year}-${this.monthsList[i]}`, "YYYY-MM").format('MMMM');
      this.monthsArray.push(this.getMonthGroup({ month: monthText, value: 0, flag: Flag.M, period: period }));
    }
  }

  private resetMonths() {
    this.form.controls['months'] = new FormArray([]);
  }

  private initForm() {
    this.form = new FormGroup({
      station:  new FormControl(null, Validators.required),
      element:  new FormControl(null, Validators.required),
      year:     new FormControl(new Date().getFullYear(), Validators.required),
      months:   new FormArray([])
    });
  }
}
