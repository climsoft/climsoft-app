import { SynopticPayload } from './../../../../data/interface/data-entry-synoptic-payload';
import { SynopticFormGroupComponent } from './../../components/synoptic-form-group/synoptic-form-group.component';
import { ConfirmationComponent } from './../../../../shared/dialogs/confirmation/confirmation.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { filter, map, tap } from 'rxjs/operators';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';

import { IDataEntryForm } from '@data/interface/data-entry-form';
import { DataEntryService } from './../../services/data-entry.service';
import { ResponsiveService } from '@shared/services/responsive.service';
import { Station } from 'src/app/data/interface/station';
import { Flag } from '@data/enum/flag';
import { of, delay } from 'rxjs';

const groupsList = [
  { element: 192, key: 'cloudHeight',   label: 'Height of Cloud' },
  { element: 110, key: 'visibility',    label: 'Visibility' },
  { element: 114, key: 'cloudCover',    label: 'Total Cloud Cover' },
  { element: 112, key: 'windDirection', label: 'Wind Direction' },
  { element: 111, key: 'windSpeed',     label: 'Wind Speed' },
  { element: 101, key: 'dryBulb',       label: 'Dry Bulb' },
  { element: 102, key: 'wetBulb',       label: 'Wet Bulb' },
  { element: 103, key: 'dewPoint',      label: 'Dew Point' },
  { element: 105, key: 'relativeHum',   label: 'Relative Humidity' },
  { element: 106, key: 'stnLevelPress', label: 'Station Level Pressure' },
  { element: 107, key: 'seaLevelPress', label: 'Height of cloud' },
  { element: 0,   key: 'rainFall',      label: 'Rain Fall' }, // ??
  { element: 167, key: 'presentWx',     label: 'Present WX' },
  { element: 0,   key: 'pastWx1',       label: 'Past WX 1' }, // ??
  { element: 0,   key: 'pastWx2',       label: 'Past WX 2' }, // ??
  { element: 0,   key: 'nh',            label: 'Nh' }, // ??
  { element: 0,   key: 'cl',            label: 'Cl' }, // ??
  { element: 193, key: 'cm',            label: 'Cm' }, // ??
  { element: 0,   key: 'ch',            label: 'Ch' }, // ??
  { element: 3,   key: 'tmin',          label: 'Temperature Min' },
  { element: 0,   key: 'gmin',          label: 'G Min' }, // ??
  { element: 116, key: 'cldAmtLvl1',    label: 'Cloud Amt Level 1' },
  { element: 117, key: 'cldTpLvl1',     label: 'Cloud Type Level 1' },
  { element: 118, key: 'cldHtLvl1',     label: 'Cloud Height Level 1' },
  { element: 120, key: 'cldAmtLvl2',    label: 'Cloud Amt Level 2' },
  { element: 121, key: 'cldTpLvl2',     label: 'Cloud Type Level 2' },
  { element: 122, key: 'cldHtLvl2',     label: 'Cloud Height Level 2' },
  { element: 124, key: 'cldAmtLvl3',    label: 'Cloud Amt Level 3' },
  { element: 125, key: 'cldTpLvl3',     label: 'Cloud Type Level 3' },
  { element: 126, key: 'cldHtLvl3',     label: 'Cloud Height Level 3' },
  { element: 128, key: 'cldAmtLvl4',    label: 'Cloud Amt Level 4' },
  { element: 129, key: 'cldTpLvl4',     label: 'Cloud Type Level 4' },
  { element: 130, key: 'cldHtLvl4',     label: 'Cloud Height Level 4' }
];

@Component({
  selector: 'app-form-synoptic2-caribbean',
  templateUrl: './form-synoptic2-caribbean.component.html',
  styleUrls: ['./form-synoptic2-caribbean.component.scss']
})
export class FormSynoptic2CaribbeanComponent implements OnInit, IDataEntryForm {
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
  hour!: number;
  raw: any;
  hasRecord = false;
  activeItem = 0;

  hoursList = [24, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  constructor(
      private modalService: BsModalService,
      private responsiveSvc: ResponsiveService,
      private dataEntryService: DataEntryService
    ) {}

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
    this.hour = this.f['hour'].value;
    this.loadSynopData();
  }

  onSubmit(e: Event) {
    this.submitted = true;
    // if(this.form.invalid) {
    //   return false;
    // }
    // this.hasRecord ? this.updateRecord() : this.addRecord();
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
    const dialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
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

  private getTagGroup(index: number, element: number, key: string, label: string, value: number, flag?: string): FormGroup {
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
      this.groupArray.push(this.getTagGroup(i, groupsList[i].element, groupsList[i].key, groupsList[i].label, 0));
    }
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
            this.patchForm(data)
          });
    }
  }

  private patchForm(data: any) {
    this.formGroups.forEach((g, i) => {
      const num = (i+1 < 10) ? `0${i+1}` : (i+1);
      const patchValue = { day: i+1, value: data[`day${num}`], flag: data[`flag${num}`] };
      g.patchValue({ ...patchValue });
    });
  }

  private addRecord() {
    let formVal: any = {
      station_id: this.station?.station_id,
      yyyy: this.year,
      mm: this.month,
      dd: this.day,
      hh: this.hour
    };

    this.formGroups.forEach((g, i) => {
      const num = (i+1 < 10) ? `0${i+1}` : (i+1);
      formVal[`day${num}`] = g.controls['value'].value;
      formVal[`flag${num}`] = g.controls['flag'].value;
      formVal[`period${num}`] = g.controls['period'].value;
    });

    // formVal['signature'] = this.f['signature'].value;
    formVal['entry_datetime'] =  new Date().toISOString();

    console.log(formVal);
    // this.dataEntryService.addDailyEntry(formVal)
  }

  private updateRecord() {
    // this.dataEntryService.updateDailyEntry(this.station?.station_id, this.element?.element_id, this.year, this.month, this.hour, formVal)
  }

  private save(payload: SynopticPayload) {
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

  private update(payload: SynopticPayload) {
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
      total: 0,
      signature: '',
      entry_datetime: new Date()
    };
    this.synopticGroup.forEach(fg => {
      const target = { ...fg.group.value };
      payload[`val_elem${this.formatEl(target.element)}`] = target.value;
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

