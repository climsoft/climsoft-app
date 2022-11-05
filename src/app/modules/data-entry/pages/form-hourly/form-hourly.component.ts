import { take } from 'rxjs/operators';
import { ConfirmationComponent } from './../../../../shared/dialogs/confirmation/confirmation.component';
import { HourlyPayload, HourlyState } from './../../../../data/interface/data-entry-hourly-payload';
import { DailyDayFormGroupComponent } from './../../components/daily-day-form-group/daily-day-form-group.component';
import { ElementService } from './../../../element/services/element.service';
import { StationService } from './../../../station/services/station.service';
import { DataEntryService } from './../../services/data-entry.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';

import { ResponsiveService } from '@shared/services/responsive.service';
import { ObsElement } from '@data/interface/element';
import { Station } from '@data/interface/station';
import { ElementLimits, HourlyRecord } from '@data/interface/data-entry-form';
import { IDataEntryForm } from '@data/interface/data-entry-form';

import * as moment from 'moment';
import { Flag } from '@data/enum/flag';
import { of, delay, tap, switchMap, filter } from 'rxjs';

@Component({
  selector: 'app-form-hourly',
  templateUrl: './form-hourly.component.html',
  styleUrls: ['./form-hourly.component.scss']
})
export class FormHourlyComponent implements OnInit, IDataEntryForm {
  @ViewChildren('hourlyGroup') hourlyGroup!: QueryList<DailyDayFormGroupComponent>;

  form!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  monthModified: boolean = false;

  station!: Station | undefined;
  element!: ObsElement | undefined;
  limits!: ElementLimits | null;

  monthYearValue: Date = new Date();
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'DD/MM/YYYY'
  };
  date!: Date;
  raw: any;
  hasRecord = false;
  activeHour = 0;

  hoursList = [24, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

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

    this.dataEntryService.hourlyState
        .pipe(
          tap((st) => this.loading = !!st),
          filter(st => !!st),
          take(1)
        )
        .subscribe((st: HourlyState) => {
          this.setFormState(+st.station, +st.element, moment(st.date).toDate());
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

  get hasChanges(): boolean {
    return this.hourlyGroup.toArray().filter((gp) => gp.isDirty === true).length > 0;
  }

  get invalidEntries(): boolean {
    return this.hourlyGroup.toArray().filter(gp => !!gp.isInvalid).length > 0;
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
    this.loadHourlyData();
  }

  resetElement() {
    this.element = undefined;
    this.form.controls['element'].reset();
    this.limits = null;
  }

  onElementSelect(data: ObsElement) {
    this.element = data;
    this.form.controls['element'].setValue(data.element_id);
    this.limits = (data.lower_limit && data.upper_limit)? { lower: +data.lower_limit, upper: +data.upper_limit } : null;
    this.loadHourlyData();
  }

  onDateSelection(data: Date) {
    if(data) {
      this.date = data;
      this.date = new Date(data);
      this.loadHourlyData();
    }
  }

  getHoursValue(h: number) {
    const tempDate = moment().set('hours', h).startOf('hour');
    return tempDate.format('HH:mm');
  }

  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
  }

  onSubmit(e: Event) {
    this.submitted = true;

    if(this.form.invalid && !this.f['hours'].invalid) {
      return;
    }
    if(this.invalidEntries) {
      this.error = 'The monthly data contains some invalid entried, please fix the items and try again.'
      return;
    }
    console.log(+this.f['total'].value, this.calcTotal, +this.f['total'].value === this.calcTotal);
    if(+this.f['total'].value !== this.calcTotal) {
      this.error = `The days based data total does not match with the total provided, please check the values and try again.`;
      return;
    }

    const pl = this.buildPayload();
    this.error = '';
    this.hasRecord? this.update(pl) : this.save(pl);
  }

  onReset() {
    this.form.reset();
    this.initForm();
  }

  onCancel() {}

  onReturn(e: Event) {
    e.preventDefault();
  }

  get dateText() {
    return moment(this.date).format('DD MMM YYYYY');
  }

  get calcTotal(): number {
    if(!this.hourlyGroup) {
      return 0;
    }
    return this.hourlyGroup.toArray().reduce((ac, g) => {
      const val: number = g.group.value.value? +g.group.value.value : 0;
      return ac = val + ac;
    }, 0);
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
      flag:   new FormControl(Flag.N)
    });

    if(data) {
      formGroup.patchValue(data);
    }

    return formGroup;
  }

  private renderFormHours() {
    this.resetHours();
    for(let i=0; i < this.hoursList.length; i++) {
      this.hoursArray.push(this.getHourGroup({ hour: i, value: '', flag: Flag.N }));
    }
  }

  hourFocus(h: number) {
    this.activeHour = h;
  }

  hourBlur(d: number) {}

  handleReturn(h: number) {
    const total = this.hourlyGroup.toArray().length;
    if(h < total - 1) {
      this.hourlyGroup.toArray()[+h + 1].focusValue();
    }
  }

  revertDay(hh: number) {
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
          const postFix = (hh<10? '0' : '') + hh;
          const hVal = this.raw[`hh_${postFix}`];
          const fVal = this.raw[`flag${postFix}`];
          this.formHoursGroups[hh] = this.getHourGroup({ hour: hh, value: +hVal, flag: Flag.N });
        } else {
          this.formHoursGroups[hh] = this.getHourGroup({ hour: hh, value: '', flag: Flag.N });
        }
      }
    });
  }

  private resetHours() {
    this.form.controls['hours'] = new FormArray([]);
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

  private setFormState(station: number, element: number, date: Date) {
    this.monthYearValue = moment(date).toDate();
    this.stationService.getStation(station)
        .pipe(
          tap((res) => {
            this.station = res.result[0];
            this.form.controls['station'].setValue(this.station?.station_id);
          }),
          switchMap((res) => this.elementService.getElement(element))
        )
        .subscribe((res) => {
          this.element = res.result[0];
          this.form.controls['element'].setValue(this.element?.element_id);
          this.renderFormHours();
          this.loadHourlyData();
        });
  }

  private loadHourlyData() {
    console.log(this.monthYearValue);
    console.log(this.date);

    if(this.station && this.element && this.date) {
      const date = moment(this.date);
      const yyyy = date.year();
      const mm = date.month() + 1;
      const dd = date.date();
      console.log(yyyy, mm, dd);

      this.loading = true;
      this.dataEntryService.getHourlyEntry(this.station.station_id, this.element.element_id, yyyy, mm, dd).subscribe((res: any) => {
        console.log(res);
        this.hasRecord = res.result.length > 0;
        if(res.result.length) {
          this.raw = res.result[0];
          this.patchForm(res.result[0]);
          this.focusFirst();
        } else {
          this.renderFormHours();
          this.f['total'].setValue(0);
          // this.renderFormHours(new Date(`${this.month}-1-${this.year}`), false);
          this.focusFirst();
        }
        this.loading = false;
      });
    }
  }

  private patchForm(data: any) {
    let total = 0;
    this.formHoursGroups.forEach((g, i) => {
      const num = (i < 10) ? `0${i}` : (i);
      const patchValue = { hour: i, value: data[`hh_${num}`], flag: data[`flag${num}`] || Flag.N };
      g.patchValue({ ...patchValue });
      total += +data[`hh_${num}`];
    });
    this.f['total'].setValue(total || 0);
  }

  private save(payload: HourlyPayload) {
    console.log(payload);
    payload.mm = payload.mm + 1
    this.dataEntryService.addHourlyEntry(payload).subscribe((res) => {
      console.log(res);
      this.form.markAsPristine();
    });
  }

  private update(payload: HourlyPayload) {
    console.log(payload);
    const date = moment(this.date);
    const yyyy = date.year();
    const mm = date.month() + 1;
    const dd = date.date();
    console.log(yyyy, mm, dd);
    if(this.station && this.element && this.date) {
      this.dataEntryService.updateHourlyEntry(this.station.station_id, this.element.element_id, yyyy, mm, dd, payload).subscribe((res) => {
        console.log(res);
        this.form.markAsPristine();
      });
    }
  }

  private buildPayload(): any {
    const mom = moment(this.date);
    const payload: any = {
      station_id: this.station?.station_id,
      element_id: this.element?.element_id,
      yyyy: mom.year(),
      mm: mom.month(),
      dd: mom.date(),
      total: 0,
      signature: '',
      entry_datetime: new Date()
    };
    const formVal = this.form.value;
    formVal.hours = this.formHoursGroups.map(fg => ({ ...fg.value, flag: fg.value.flag || null }));
    for(let h of formVal.hours) {
      const post = h.hour < 10 ? `0${h.hour}` : `${h.hour}`;
      payload[`hh_${post}`] = h.value;
      payload[`flag${post}`] = h.flag || null;
    }

    return payload;
  }

  private focusFirst() {
    of(true)
      .pipe(delay(100))
      .subscribe(() => {
        this.hourlyGroup.toArray()[0].focusValue();
      });
  }
}
