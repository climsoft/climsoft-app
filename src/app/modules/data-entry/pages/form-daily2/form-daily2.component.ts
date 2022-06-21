import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationComponent } from '@shared/dialogs/confirmation/confirmation.component';
import { NavigationEnd, Router } from '@angular/router';
import { IDeactivateComponent } from '@data/interface/deactivate-component';
import { DailyDayFormGroupComponent } from './../../components/daily-day-form-group/daily-day-form-group.component';
import { Component, OnInit, ElementRef, QueryList, ViewChildren } from '@angular/core';
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
export class FormDaily2Component implements OnInit, IDataEntryForm, IDeactivateComponent {
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
  raw: any;

  @ViewChildren('dailyGroup') dailyGroup!: QueryList<DailyDayFormGroupComponent>;

  constructor(
      private router: Router,
      private modalService: BsModalService,
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

  public canExit(): boolean {
    const question = 'You have unsaved changes. Are you sure you want to leave the page?';
    return this.hasChanges ? window.confirm(question) : true;
  };

  get f() {
    return this.form.controls;
  }

  get isEditable(): boolean {
    return !!this.station && !!this.element;
  }

  get isModified(): boolean {
    return this.monthModified;
  }

  get hasChanges(): boolean {
    return this.dailyGroup.toArray().filter((gp) => gp.isDirty === true).length > 0;
  }

  get invalidEntries(): boolean {
    return this.dailyGroup.toArray().filter(gp => !!gp.isInvalid).length > 0;
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
    if(this.form.invalid) {
      return;
    }
    if(this.invalidEntries) {
      this.error = 'The monthly data contains some invalid entried, please fix the items and try again.'
      return;
    }
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
    // TODO: Whether there is a record available or not on reset should attampt the reload from backend and set the status of form back to original
    // TODO: Except if there are any dirty values then do below.
    const config = {
      title: `Confirm Reset`,
      message: `You have changes in the form below, are you sure you want to reset?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    dialogRef.content.onClose.subscribe((opt: boolean) => {
      if(opt) {
        this.form.reset();
        this.station = undefined;
        this.element = undefined;
        this.dataEntryService.resetDailyState();
        this.initForm();
      }
    });
  }

  onCancel() {
    this.router.navigateByUrl('/');
  }

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

  revertDay(day: number) {
    const config = {
      title: `Confirm Revert`,
      message: `Are you sure you want to revert to original values?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    dialogRef.content.onClose.subscribe((opt: boolean) => {
      if(opt) {
        if(this.hasRecord) {
          const postFix = (day<10? '0' : '') + day;
          const dVal = this.raw[`day${postFix}`];
          const fVal = this.raw[`flag${postFix}`];
          const pVal = this.raw[`period${postFix}`];
          this.formDaysGroups[day-1] = this.getDayGroup(day, dVal, fVal, pVal);
        } else {
          this.formDaysGroups[day-1] = this.getDayGroup(day);
        }
      }
    });
  }

  private resetDays() {
    this.form.controls['days'] = new FormArray([]);
  }

  private getDayGroup(day: number, value?: number, flag?: string, period?: number): FormGroup {
    return new FormGroup({
      day:    new FormControl(day),
      value:  new FormControl(value, [Validators.min(0), Validators.max(70)]),
      flag:   new FormControl(flag || Flag.M),
      period: new FormControl(period)
    });
  }

  private renderFormDays(date: Date, load: boolean = true) {
    let selDate = moment(date);
    this.year = selDate.year();
    this.month = selDate.month() + 1;
    const days = moment(`${this.year}-${this.month}`, "YYYY-MM").daysInMonth();
    this.resetDays();
    for(let i=1; i <= days; i++) {
      this.daysArray.push(this.getDayGroup(i));
    }
    if(load) {
      this.loadDailyData();
    }
  }

  private initForm() {
    this.form = new FormGroup({
      station:        new FormControl(null, Validators.required),
      element:        new FormControl(null, Validators.required),
      element_seq:    new FormControl(false),
      monthYear:      new FormControl(new Date(), Validators.required),
      dayHour:        new FormControl(6, [Validators.min(0), Validators.max(24)]),
      temperature:    new FormControl(''),
      precip:         new FormControl(''),
      cloud_height:   new FormControl(''),
      visibility:     new FormControl(''),
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
      this.loading = true;
      this.dataEntryService.getDailyEntry(this.station.station_id, this.element.element_id, this.year, this.month, this.hour).subscribe((res) => {
        console.log(res);
        this.hasRecord = res.result.length > 0;
        if(res.result.length) {
          this.raw = res.result[0];
          this.patchForm(res.result[0]);
        } else {
          this.resetDays();
          this.renderFormDays(this.monthYearValue, false);
        }
        this.loading = false;
      });
    }
  }

  private patchForm(data: any) {
    this.f['temperature'].setValue(data['temperature_units']);
    this.f['precip'].setValue(data['precip_units']);
    this.f['cloud_height'].setValue(data['cloud_height_units']);
    this.f['visibility'].setValue(data['vis_units']);

    this.formDaysGroups.forEach((g, i) => {
      const num = (i+1 < 10) ? `0${i+1}` : (i+1);
      const patchValue = { day: i+1, value: data[`day${num}`], flag: data[`flag${num}`] || Flag.X, period: data[`period${num}`] };
      g.patchValue({ ...patchValue });
    });
  }

  private addRecord() {

    // TODO: Apply relevant validation for all records
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
    // TODO: For any dirty records if any of the value, flag or period are same as original, ignore the property and do not send in update payload.
    // this.dataEntryService.updateDailyEntry(this.station?.station_id, this.element?.element_id, this.year, this.month, this.hour, formVal)
  }
}
