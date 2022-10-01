import { ConfirmationComponent } from './../../../../shared/dialogs/confirmation/confirmation.component';
import { HourlyWindFormGroupComponent } from './../../components/hourly-wind-form-group/hourly-wind-form-group.component';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';


import { ResponsiveService } from '@shared/services/responsive.service';
import { Flag } from '@data/enum/flag';
import { HourlyWindRecord } from '@data/interface/data-entry-form';
import { Station } from '@data/interface/station';
import { StationService } from '@station/services/station.service';
import { DataEntryService } from './../../services/data-entry.service';
import { delay, filter, map, merge, of, take, tap, switchMap } from 'rxjs';
import { HourlyWindState, HourlyWindPayload } from '@data/interface/data-entry-hourly-wind-payload';
import * as _ from 'cypress/types/lodash';

@Component({
  selector: 'app-form-hourly-wind',
  templateUrl: './form-hourly-wind.component.html',
  styleUrls: ['./form-hourly-wind.component.scss']
})
export class FormHourlyWindComponent implements OnInit {
  @ViewChildren('hourlyWindGroup') hourlyWindGroup!: QueryList<HourlyWindFormGroupComponent>;

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
  raw: any;
  hasRecord = false;
  activeHour = 0;

  hoursList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
  config: any = {
    elem_111: {},
    elem_112: {}
  };

  constructor(
    private router: Router,
    private modalService: BsModalService,
    private responsiveSvc: ResponsiveService,
    private dataEntryService: DataEntryService,
    private stationService: StationService
  ) {
    this.initConfig();
  }

  ngOnInit(): void {
    this.initForm();
    // console.log(MediaQueryListEvent);
    this.responsiveSvc.screenSize.subscribe(x => {
      console.log(x);
      // this.size = x;
    });

    this.dataEntryService.hourlyWindState
    .pipe(
      tap((st) => this.loading = !!st),
      filter(st => !!st),
      take(1)
    )
    .subscribe((st: HourlyWindState) => {
      console.log(st);
      this.setFormState(+st.station, new Date(st.date));
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

  get hasChanges(): boolean {
    return this.hourlyWindGroup.toArray().filter((gp) => gp.isDirty === true).length > 0;
  }

  get invalidEntries(): boolean {
    return this.hourlyWindGroup.toArray().filter(gp => !!gp.isInvalid).length > 0;
  }

  get ddffConfig(): any {
    return { dd: this.config.elem_112.key_value, ff: this.config.elem_111.key_value };
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
    this.loadHourlyWindData();
  }

  onSubmit(e: Event) {
    this.submitted = true;

    if(this.form.invalid && !this.f['hours'].invalid) {
      return;
    }
    if(this.invalidEntries) {
      this.error = 'The hourly wind data contains some invalid entried, please fix the items and try again.'
      return;
    }
    console.log(+this.f['total'].value, this.calcTotal, +this.f['total'].value === this.calcTotal);
    if(+this.f['total'].value !== this.calcTotal) {
      this.error = `The hours based data total does not match with the total provided, please check the values and try again.`;
      return;
    }

    const pl = this.buildPayload();
    this.error = '';
    this.hasRecord? this.update(pl) : this.save(pl);
  }

  onDateSelection(data: Date) {
    if(data) {
      this.date = new Date(data);
      this.renderFormHours(data);
      this.loadHourlyWindData();
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

  onReturn(e: Event) {
    e.preventDefault();
  }

  onOpenCalendar(container: any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
  }

  getDateText() {
    return moment(this.date).format('DD MMM YYYYY');
  }

  get calcTotal(): number {
    if(!this.hourlyWindGroup) {
      return 0;
    }
    return this.hourlyWindGroup.toArray().reduce((ac, g) => {
      const ff: number = g.group.value.ff? + g.group.value.ff : 0;
      return ac = ff + ac;
    }, 0);
  }

  get hoursArray(): FormArray {
    return this.form.get('hours') as FormArray;
  }

  get formHoursGroups(): FormGroup[] {
    return this.hoursArray.controls as FormGroup[];
  }

  handleReturn(h: number) {
    const total = this.hourlyWindGroup.toArray().length;
    if(h < total - 1) {
      this.hourlyWindGroup.toArray()[+h + 1].focusValue();
    }
  }

  revertHour(hh: number) {
    console.log(hh);
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
          const dd = this.raw[`elem_111_${postFix}`];
          const ff = this.raw[`elem_112_${postFix}`];
          const flag = this.raw[`ddflag${postFix}`];
          this.formHoursGroups[hh] = this.getHourGroup({ hour: hh, ddff: 0, dd, ff, flag: flag || Flag.N });
        } else {
          this.formHoursGroups[hh] = this.getHourGroup({ hour: hh, ddff: 0, dd: 0, ff: 0, flag: Flag.N });
        }
      }
    });
  }

  hourFocus(h: number) {
    this.activeHour = h;
  }

  hourBlur(d: number) {}

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
    for(let i=0; i < this.hoursList.length; i++) {
      this.hoursArray.push(this.getHourGroup({ hour: i, ddff: 0, dd: 0, ff: 0, flag: Flag.N }));
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

  private setFormState(station: number, date: Date) {
    this.monthYearValue = date;
    this.stationService.getStation(station)
        .subscribe((res) => {
          this.station = res.result[0];
          this.form.controls['station'].setValue(this.station?.station_id);
          this.renderFormHours(date);
          this.loadHourlyWindData();
        });
  }

  private loadHourlyWindData() {
    console.log(this.monthYearValue);
    console.log(this.date);

    if(this.station && this.date) {
      const date = moment(this.date);
      const yyyy = date.year();
      const mm = date.month() + 1;
      const dd = date.date();
      console.log(yyyy, mm, dd);

      this.loading = true;
      this.dataEntryService.getHourlyWindEntry(this.station.station_id, yyyy, mm, dd).subscribe((res: any) => {
        console.log(res);
        this.hasRecord = res.result.length > 0;
        if(res.result.length) {
          this.raw = res.result[0];
          this.patchForm(res.result[0]);
          this.focusFirst();
        } else {
          this.renderFormHours(this.monthYearValue);
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
      const patchValue = {
        hour: i,
        ddff: `${data[`elem_111_${num}`]}${data[`elem_112_${num}`]}`,
        dd: data[`elem_111_${num}`],
        ff: data[`elem_112_${num}`],
        flag: data[`ddflag${num}`] || Flag.N
      };
      g.patchValue({ ...patchValue });
      total += +data[`hh_${num}`];
    });
    this.f['total'].setValue(total || 0);
  }

  private save(payload: HourlyWindPayload) {
    console.log(payload);
    payload.mm = payload.mm + 1
    this.dataEntryService.addHourlyWindEntry(payload).subscribe((res) => {
      console.log(res);
      this.form.markAsPristine();
    });
  }

  private update(payload: HourlyWindPayload) {
    console.log(payload);
    const date = moment(this.date);
    const yyyy = date.year();
    const mm = date.month() + 1;
    const dd = date.date();
    if(this.station && this.date) {
      this.dataEntryService.updateHourlyWindEntry(this.station.station_id, yyyy, mm, dd, payload).subscribe((res) => {
        console.log(res);
        this.form.markAsPristine();
      });
    }
  }

  private buildPayload(): HourlyWindPayload {
    const mom = moment(this.date);
    const raw: any = {
      station_id: this.station?.station_id,
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
      raw[`elem_111_${post}`] = h.dd;
      raw[`elem_112_${post}`] = h.ff;
      raw[`ddflag${post}`] = h.flag || null;
    }

    const payload = { ...raw };
    return payload;
  }

  private focusFirst() {
    of(true)
      .pipe(delay(100))
      .subscribe(() => {
        this.hourlyWindGroup.toArray()[0].focusValue();
      });
  }

  private initConfig() {
    this.dataEntryService.elementLookup(554)
        .pipe(map((res: any) => res.result[0]))
        .subscribe(res => console.log(res));

    this.dataEntryService.elementLookup(111)
      .pipe(
        tap((res: any) => {
          const obj = res.result[0];
          this.config.elem_111 = { element_id: obj.element_id, element_name: obj.element_name, element_scale: obj.element_scale };
        }),
        switchMap(res => this.dataEntryService.elementLookup(112))
      )
      .subscribe((res: any) => {
        const obj = res.result[0];
        this.config.elem_112 = { element_id: obj.element_id, element_name: obj.element_name, element_scale: obj.element_scale };
        this.initKeys();
      });
  }

  private initKeys() {
    this.dataEntryService.getRegKeys()
      .pipe(
        map((res: any) => {
          return res.result
                    .filter((item: any) => ['key05', 'key06'].includes(item.key_name))
                    .map((item: any) => ({ ...item, key_value: +item.key_value }));
        })
      )
      .subscribe((keys) => {
        this.config.elem_111 = { ...this.config.elem_111, ...keys[1] };
        this.config.elem_112 = { ...this.config.elem_112, ...keys[0] };
        console.log(this.config);
      });
  }
}
