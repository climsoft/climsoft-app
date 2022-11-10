import { StationService } from '@station/services/station.service';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { of, delay, take } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';

import { IDataEntryForm } from '@data/interface/data-entry-form';
import { Flag } from '@data/enum/flag';
import { Station } from '@data/interface/station';
import { SynopticRAPayload, SynopticState } from '@data/interface/data-entry-synoptic-payload';
import { ConfirmationComponent } from '@shared/dialogs/confirmation/confirmation.component';
import { ResponsiveService } from '@shared/services/responsive.service';
import { SynopticFormGroupComponent } from './../../components/synoptic-form-group/synoptic-form-group.component';
import { DataEntryService } from './../../services/data-entry.service';

const groupsList = [
  { element: 106, key: 'stnLevelPress', label: 'Station Level Pressure' }, // 1
  { element: 107, key: 'seaReducedMSLP',label: 'Pressure Reduced to MSL-P' }, // 2
  { element: 400, key: '3HrPressCh',    label: '3Hr Pressure Change-P3' }, // 3
  { element: 814, key: '3HrPressCh',    label: '3Hr Pressure Characteristic' }, // 4
  { element: 399, key: '24HrPressCh',   label: '24Hr Pressure Change-P24' }, // 5
  { element: 301, key: 'stPressLevelA', label: 'Standard Pressure Level-a' }, // 6
  { element: 185, key: 'geoPotHeight',  label: 'Geopotential Height-hhh' }, // 7
  { element: 102, key: 'wetBulbTemp',   label: 'Wet Bulb Temp-TwTwTw' }, // 8
  { element: 101, key: 'dryBulbTemp',   label: 'Dry Bulb Temp-TTT' }, // 9
  { element: 103, key: 'dewPoint',      label: 'Dew Point-TdTdTd' }, // 10
  { element: 105, key: 'relativeHum',   label: 'Relative Humidity-U' }, // 11
  { element: 192, key: 'visibility',    label: 'Horizontal Visibility-VV' }, // 12
  { element: 110, key: 'visibility',    label: 'Low Cloud Height-h' }, // 13
  { element: 114, key: 'cloudCover',    label: 'Total Cloud Cover-N' }, // 14
  { element: 115, key: 'verticalSig',   label: 'Vertical Significance' }, // 15
  { element: 168, key: 'lowLvlCldNh',   label: 'Low Lvl Clouds Amt-Nh' }, // 16
  { element: 169, key: 'lowLvlCldCl',   label: 'Low Lvl Clouds Type-CL' }, // 17
  { element: 170, key: 'medLvlCldCm',   label: 'Medium Lvl Clouds Type-CM' }, // 18
  { element: 171, key: 'highLvlCldCh',  label: 'High Level Clouds Type-CH' }, // 19
  { element: 119, key: 'vertSig1',      label: 'Vertical Significance 1' }, // 20
  { element: 116, key: 'cldAmtLvl1',    label: 'Cloud Amt Lvl1-N1' }, // 21
  { element: 117, key: 'cldTpLvl1',     label: 'Cloud Type Lvl1-C1' }, // 22
  { element: 118, key: 'cldHtLvl1',     label: 'Cloud Ht Lvl1-HsHs1' }, // 23
  { element: 123, key: 'cldAmtLvl1',    label: 'Vertical Significance 2' }, // 24
  { element: 120, key: 'cldAmtLvl2',    label: 'Cloud Amt Lvl2-N2' }, // 25
  { element: 121, key: 'cldTpLvl2',     label: 'Cloud Type Lvl2-C2' }, // 26
  { element: 122, key: 'cldHtLvl2',     label: 'Cloud Ht Lvl2-HsHs2' }, // 27
  { element: 127, key: 'cldAmtLvl1',    label: 'Vertical Significance 3' }, // 28
  { element: 124, key: 'cldAmtLvl3',    label: 'Cloud Amt Lvl3-N3' }, // 29
  { element: 125, key: 'cldTpLvl3',     label: 'Cloud Type Lvl3-C3' }, // 30
  { element: 126, key: 'cldHtLvl3',     label: 'Cloud Ht Lvl3-HsHs3' }, // 31
  { element: 131, key: 'cldAmtLvl1',    label: 'Vertical Significance 4' }, // 32
  { element: 128, key: 'cldAmtLvl4',    label: 'Cloud Amt Lvl4-N4' }, // 33
  { element: 129, key: 'cldTpLvl4',     label: 'Cloud Type Lvl4-C4' }, // 34
  { element: 130, key: 'cldHtLvl4',     label: 'Cloud Ht Lvl4-HsHs4' }, // 35
  { element: 167, key: 'presentWx',     label: 'Present WX' }, // 36
  { element: 197, key: 'pastWx1',       label: 'Past WX1' }, // 37
  { element: 193, key: 'pastWx2',       label: 'Past WX2' }, // 38
  { element: 2,   key: 'tmax',          label: 'T Max' }, // 39
  { element: 3,   key: 'tmin',          label: 'T Min' }, // 40
  // { element: 99,  key: 'None',       label: 'None' }, // Null
  { element: 84,  key: 'sss24Hr',       label: 'SSS-24Hr' }, // 43
  { element: 132, key: 'sss1Hr',        label: 'SSS-1Hr' }, // 44
  { element: 5,   key: 'precip1Hr',     label: 'Precip-24Hr' }, // 45
  { element: 174, key: 'precip3Hr',     label: 'Precip-3Hr' }, // 46
  { element: 112, key: 'windDirection', label: 'Wind Direction-dd' }, // 47
  { element: 111, key: 'windSpeed',     label: 'Wind Speed-ff' }, // 48
  { element: 46,  key: 'insolation',    label: 'Insolation' }, // 49
];

@Component({
  selector: 'app-form-synoptic-ra',
  templateUrl: './form-synoptic-ra.component.html',
  styleUrls: ['./form-synoptic-ra.component.scss']
})
export class FormSynopticRaComponent implements OnInit, IDataEntryForm {
  @ViewChildren('synopticGroup') synopticGroup!: QueryList<SynopticFormGroupComponent>;

  form!: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  monthModified: boolean = false;

  station!: Station | undefined;

  monthYearValue: Date = new Date();
  date!: Date;
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'DD/MM/YYYY'
  };
  year!: number;
  month!: number;
  day!: number;
  hour: number = 6;
  raw: any;
  hasRecord = false;
  activeItem = 0;

  hoursList = [24, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  constructor(
      private modalService: BsModalService,
      private responsiveSvc: ResponsiveService,
      private dataEntryService: DataEntryService,
      private stationService: StationService
    ) {}

  ngOnInit(): void {
    this.initForm();
    // console.log(MediaQueryListEvent);
    this.responsiveSvc.screenSize.subscribe(x => {
      console.log(x);
      // this.size = x;
    });

    this.dataEntryService.synopticState
        .pipe(
          tap((st) => this.loading = !!st),
          filter(st => !!st),
          take(1)
        )
        .subscribe((st: SynopticState) => {
          console.log(st);
          this.setFormState(+st.station, new Date(`${st.month}-${st.day}-${st.year}`));
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

  get dirtyEntries(): boolean {
    return this.synopticGroup.toArray().filter(gp => !!gp.isDirty).length > 0;
  }

  get invalidEntries(): boolean {
    return this.synopticGroup.toArray().filter(gp => !!gp.isInvalid).length > 0;
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
    this.loadSynopData();
  }

  onDateSelection(date: Date) {
    if(date) {
      this.date = date;
      let selDate = moment(date);
      this.year = selDate.year();
      this.month = selDate.month() + 1;
      this.day = selDate.date();
      this.loadSynopData();
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

  onHourSelect(data: any) {
    this.hour = +this.f['hour'].value;
    this.loadSynopData();
  }

  onSubmit(e: Event) {
    this.submitted = true;
    if(this.form.invalid) {
      return;
    }
    if(!this.dirtyEntries) {
      this.error = 'The form has no inputs, please make some changes and try again.'
      return;
    }

    if(this.form.invalid && (!this.f['tempRH06GMT'].invalid || !this.f['soilTemp05GMT'].invalid || !this.f['soilTemp09GMT'].invalid || !this.f['windrunRainfall'].invalid || !this.f['sunshineEvap'].invalid || !this.f['tempRH12GMT'].invalid || !this.f['soilTemp13GMT'].invalid || !this.f['tempRSoilMoist'])) {
      return;
    }

    if(this.invalidEntries) {
      this.error = 'The agro data contains some invalid entried, please fix the items and try again.'
      return;
    }

    const payload: SynopticRAPayload = this.buildPayload();
    this.hasRecord ? this.update(payload) : this.save(payload);
  }

  get groupArray(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  get formGroups(): FormGroup[] {
    return this.groupArray.controls as FormGroup[];
  }

  keyFocus(i: number) {
    this.activeItem = i;
  }

  keyBlur(d: number) {}

  handleReturn(h: number) {
    const total = this.synopticGroup.toArray().length;
    if(h < total - 1) {
      this.synopticGroup.toArray()[+h + 1].focusValue();
    }
  }

  revertItem(day: number) {
    const config = {
      title: `Confirm Revert`,
      message: `Are you sure you want to revert to original values?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const dialogRef: BsModalRef = this.modalService.show(ConfirmationComponent, { initialState: config });
    dialogRef.content.onClose.subscribe((opt: boolean) => {
      if(opt) {
        // if(this.hasRecord) {
        //   const postFix = (day<10? '0' : '') + day;
        //   const dVal = this.raw[`day${postFix}`];
        //   const fVal = this.raw[`flag${postFix}`];
        //   const pVal = this.raw[`period${postFix}`];
        //   this.formDaysGroups[day-1] = this.getDayGroup(day, dVal, fVal, pVal);
        // } else {
        //   this.formDaysGroups[day-1] = this.getDayGroup(day);
        // }
      }
    });
  }

  private getTagGroup(index: number, element: number, key: string, label: string, value: number | string, flag?: string): FormGroup {
    return new FormGroup({
      index:  new FormControl(index),
      element: new FormControl(element),
      key:    new FormControl(key),
      label:  new FormControl(label),
      value:  new FormControl(value),
      flag:   new FormControl(flag || Flag.N),
    });
  }

  private initForm() {
    this.form = new FormGroup({
      station:        new FormControl(null, Validators.required),
      dayMonthYear:   new FormControl(new Date(), Validators.required),
      hour:           new FormControl(6, [Validators.min(0), Validators.max(24)]),
      tags:           new FormArray([])
    });

    for(let i=0; i < groupsList.length; i++) {
      this.groupArray.push(this.getTagGroup(i, groupsList[i].element, groupsList[i].key, groupsList[i].label, ''));
    }
  }

  private setFormState(station: number, date: Date) {
    this.monthYearValue = date;
    this.stationService.getStation(station)
        .subscribe((res) => {
          this.station = res.result[0];
          this.form.controls['station'].setValue(this.station?.station_id);
          this.loadSynopData();
        });
  }

  private loadSynopData() {
    console.log(this.station, this.year, this.month, this.day);
    if(this.station && this.year && this.month && this.day && this.hour) {
      this.dataEntryService.getSynopticEntry(this.station.station_id, this.year, this.month, this.day, this.hour)
          .pipe(
            tap((res: any) => { this.hasRecord = res.result.length > 0 }),
            filter((res: any) => res.result.length),
            map((res: any) => res.result[0])
          )
          .subscribe(data => {
            console.log(data);
            this.hasRecord = true;
            this.patchForm(data);
            this.loading = false;
          });
    }
  }

  private patchForm(data: any) {
    this.synopticGroup.forEach((g, i) => {
      let groupVal = { ...g.group.value };
      const patchVal = {
        value: data[`val_elem${this.formatEl(groupVal.element)}`],
        flag: data[`flag${this.formatEl(groupVal.element)}`]
      };
      g.group.patchValue({ ...patchVal });
    });
  }

  private save(payload: SynopticRAPayload) {
    if(payload.mm) {
      payload.mm = payload.mm + 1;
    }
    payload['entry_datetime'] =  new Date();
    console.log(payload);
    this.dataEntryService.addSynopticEntry(payload).subscribe((res) => {
      console.log(res);
      this.form.markAsPristine();
    });
  }

  private update(payload: SynopticRAPayload) {
    console.log(payload);
    const date = moment(this.date);
    const yyyy = date.year();
    const mm = date.month() + 1;
    const dd = date.date();
    console.log(yyyy, mm, dd);
    delete payload.dd;
    delete payload.mm;
    delete payload.yyyy;
    if(this.station && this.date) {
      this.dataEntryService.updateSynopEntry(this.station.station_id, yyyy, mm, dd, this.hour, payload).subscribe((res) => {
        console.log(res);
        this.form.markAsPristine();
      });
    }
  }

  private formatEl(num: number) {
    if (num < 10) return `00${num}`;
    if(num < 100) return `0${num}`;

    return `${num}`;
  }

  private buildPayload(): any {
    const mom = moment(this.date);
    const payload: any = {
      station_id: this.station?.station_id,
      yyyy: mom.year(),
      mm: mom.month(),
      dd: mom.date(),
      hh: this.hour,
      Val_Elem099: null,
      total: 0,
      signature: '',
      entry_datetime: new Date()
    };
    this.synopticGroup.forEach(fg => {
      const target = { ...fg.group.value };
      payload[`Val_Elem${this.formatEl(target.element)}`] = target.value;
      payload[`flag${this.formatEl(target.element)}`] = target.flag;
    });

    return payload;
  }

  private focusFirst() {
    of(true)
      .pipe(delay(100))
      .subscribe(() => {
        this.synopticGroup.toArray()[0].focusValue();
      });
  }
}
