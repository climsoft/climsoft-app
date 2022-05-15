import { ResponsiveService } from '@shared/services/responsive.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { HourlyWindRecord } from '@data/interface/data-entry-form';
import * as moment from 'moment';
import { Station } from '@data/interface/station';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Flag } from '@data/enum/flag';

@Component({
  selector: 'app-form-hourly-wind',
  templateUrl: './form-hourly-wind.component.html',
  styleUrls: ['./form-hourly-wind.component.scss']
})
export class FormHourlyWindComponent implements OnInit {
  form!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  monthModified: boolean = false;

  station!: Station | undefined;

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
    return !!this.station;
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

  private getHourGroup(data: HourlyWindRecord): FormGroup {
    const formGroup = new FormGroup({
      hour:   new FormControl(null),
      ddff:   new FormControl(null),
      dd:     new FormControl(null),
      ff:     new FormControl(null),
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
      this.hoursArray.push(this.getHourGroup({ hour: i, ddff: 0, dd: 0, ff: 0, flag: Flag.M }));
    }
  }

  private resetHours() {
    this.form.controls['hours'] = new FormArray([]);
  }

  private initForm() {
    this.form = new FormGroup({
      station:        new FormControl(null, Validators.required),
      date:           new FormControl(new Date(), Validators.required),
      hours:          new FormArray([]),
      total:          new FormControl(null)
    });
  }
}
