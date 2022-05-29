import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';

import { Station } from '@data/interface/station';
import { ObsElement } from '@data/interface/element';
import { IDataEntryForm } from '@data/interface/data-entry-form';
import { Flag } from '@data/enum/flag';
import { UnitOptions } from '@data/enum/units';

import { ElementService } from '@element/services/element.service';
import { StationService } from '@station/services/station.service';
import { DataEntryService } from './../../services/data-entry.service';

import { ResponsiveService } from '@shared/services/responsive.service';

@Component({
  selector: 'app-form-daily2',
  templateUrl: './form-daily2.component.html',
  styleUrls: ['./form-daily2.component.scss']
})
export class FormDaily2Component implements OnInit, IDataEntryForm {
  form!: FormGroup;
  submitted = false;
  loading = true;
  error = '';
  monthModified: boolean = false;

  station!: Station | undefined;
  element!: ObsElement | undefined;

  monthYearValue: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'MM/YYYY'
  };
  year!: number;
  month!: number;
  hour: number = 6;

  unitOptions = UnitOptions;
  hoursList = [24, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  hasRecord = false;

  constructor(
      private responsiveSvc: ResponsiveService,
      private dataEntryService: DataEntryService,
      private stationService: StationService,
      private elementService: ElementService
    ) {}

  ngOnInit(): void {
    this.initForm();
    // console.log(MediaQueryListEvent);
    this.responsiveSvc.screenSize.subscribe(x => {
      console.log(x);
      // this.size = x;
    });

    this.dataEntryService.dailyState
        .pipe(
          tap((st) => this.loading = !!st),
          filter(st => !!st),
          take(1)
        )
        .subscribe((st) => {
          console.log(st);
          this.setFormState(+st.station, +st.element, st.monthYear, st.hour);
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
    this.loadDailyData();
  }

  resetElement() {
    this.element = undefined;
    this.form.controls['element'].reset();
  }

  onElementSelect(data: ObsElement) {
    this.element = data;
    this.form.controls['element'].setValue(data.element_id);
    this.loadDailyData();
  }

  onSubmit(e: Event) {
    this.submitted = true;
    // if(this.form.invalid) {
    //   return false;
    // }
    this.hasRecord ? this.updateRecord() : this.addRecord();
  }

  onDateSelection(data: Date) {
    console.log(data);
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
    this.hour = this.f['dayHour'].value;
    this.loadDailyData();
  }

  getDateText(y: number, m: number) {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return `${months[m-1]} ${y}`;
  }

  moreInfo() {
    console.log('more info');
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
      flag:   new FormControl(Flag.M),
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
    this.loadDailyData();
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

  private setFormState(station: number, element: number, date: string, hour: number) {
    this.stationService.getStation(station)
        .pipe(
          tap((res) => {
            this.station = res.result[0]
          }),
          switchMap((res) => this.elementService.getElement(element))
        )
        .subscribe((res) => {
          this.element = res.result[0];
          this.loadDailyData();
        });

    this.f['station'].setValue(station);
    this.f['element'].setValue(element);
    this.f['monthYear'].setValue(date);
    this.monthYearValue = new Date(date);
    this.f['dayHour'].setValue(hour);
  }

  private loadDailyData() {
    if(this.station && this.element && this.year && this.month && this.hour) {
      this.dataEntryService.getDailyEntry(this.station.station_id, this.element.element_id, this.year, this.month, this.hour).subscribe((res) => {
        console.log(res);
        this.hasRecord = res.result.length > 0;
        if(res.result.length) {
          this.patchForm(res.result[0]);
        }
        this.loading = false;
      });
    }
  }

  private patchForm(data: any) {
    this.formDaysGroups.forEach((g, i) => {
      const num = (i+1 < 10) ? `0${i+1}` : (i+1);
      const patchValue = { day: i+1, value: data[`day${num}`], flag: data[`flag${num}`], period: data[`period${num}`] };
      g.patchValue({ ...patchValue });
    });
  }

  private addRecord() {
    let formVal: any = {
      station_id: this.station?.station_id,
      element_id: this.element?.element_id,
      yyyy: this.year,
      mm: this.month,
      hh: this.hour
    };

    this.formDaysGroups.forEach((g, i) => {
      const num = (i+1 < 10) ? `0${i+1}` : (i+1);
      formVal[`day${num}`] = g.controls['value'].value;
      formVal[`flag${num}`] = g.controls['flag'].value;
      formVal[`period${num}`] = g.controls['period'].value;
    });

    // formVal['signature'] = this.f['signature'].value;
    formVal['entry_datetime'] =  new Date().toISOString(),
    formVal['temperature_units'] =  this.f['temperature'].value,
    formVal['precip_units'] =  this.f['precip'].value,
    formVal['cloud_height_units'] = this.f['cloud_height'].value,
    formVal['vis_units'] = this.f['visibility'].value;

    console.log(formVal);
    // this.dataEntryService.addDailyEntry(formVal)
  }

  private updateRecord() {
    console.log(this.form.value);
    // this.dataEntryService.updateDailyEntry(this.station?.station_id, this.element?.element_id, this.year, this.month, this.hour, formVal)
  }
}
