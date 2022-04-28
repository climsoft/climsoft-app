import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';

import { IDataEntryForm } from '@data/interface/data-entry-form';
import { DataEntryService } from './../../services/data-entry.service';
import { ResponsiveService } from '@shared/services/responsive.service';
import { Station } from 'src/app/data/interface/station';
import { Flag } from '@data/enum/flag';

const groupsList = [
  { key: 'cloudHeight',   label: 'Height of Cloud' },
  { key: 'visibility',    label: 'Visibility' },
  { key: 'cloudCover',    label: 'Total Cloud Cover' },
  { key: 'windDirection', label: 'Wind Direction' },
  { key: 'windSpeed',     label: 'Wind Speed' },
  { key: 'dryBulb',       label: 'Dry Bulb' },
  { key: 'wetBulb',       label: 'Wet Bulb' },
  { key: 'dewPoint',      label: 'Dew Point' },
  { key: 'relativeHum',   label: 'Relative Humidity' },
  { key: 'stnLevelPress', label: 'Station Level Pressure' },
  { key: 'seaLevelPress', label: 'Height of cloud' },
  { key: 'rainFall',      label: 'Rain Fall' },
  { key: 'presentWx',     label: 'Present WX' },
  { key: 'pastWx1',       label: 'Past WX 1' },
  { key: 'pastWx2',       label: 'Past WX 2' },
  { key: 'nh',            label: 'Nh' },
  { key: 'cl',            label: 'Cl' },
  { key: 'cm',            label: 'Cm' },
  { key: 'ch',            label: 'Ch' },
  { key: 'tmin',          label: 'Temperature Min' },
  { key: 'gmin',          label: 'G Min' },
  { key: 'cldAmtLvl1',    label: 'Cloud Amt Level 1' },
  { key: 'cldTpLvl1',     label: 'Cloud Type Level 1' },
  { key: 'cldHtLvl1',     label: 'Cloud Height Level 1' },
  { key: 'cldAmtLvl2',    label: 'Cloud Amt Level 2' },
  { key: 'cldTpLvl2',     label: 'Cloud Type Level 2' },
  { key: 'cldHtLvl2',     label: 'Cloud Height Level 2' },
  { key: 'cldAmtLvl3',    label: 'Cloud Amt Level 3' },
  { key: 'cldTpLvl3',     label: 'Cloud Type Level 3' },
  { key: 'cldHtLvl3',     label: 'Cloud Height Level 3' },
  { key: 'cldAmtLvl4',    label: 'Cloud Amt Level 4' },
  { key: 'cldTpLvl4',     label: 'Cloud Type Level 4' },
  { key: 'cldHtLvl4',     label: 'Cloud Height Level 4' }
];

@Component({
  selector: 'app-form-synoptic2-caribbean',
  templateUrl: './form-synoptic2-caribbean.component.html',
  styleUrls: ['./form-synoptic2-caribbean.component.scss']
})
export class FormSynoptic2CaribbeanComponent implements OnInit, IDataEntryForm {
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
  year!: number;
  month!: number;
  day!: number;
  hour: number = 6;

  hoursList = [24, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

  constructor(private responsiveSvc: ResponsiveService, private dataEntryService: DataEntryService) {}

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

  resetStation() {
    this.station = undefined;
    this.form.controls['station'].reset();
  }

  onStationSelect(data: Station) {
    this.station = data;
    this.form.controls['station'].setValue(data.station_id);
    this.loadDailyData();
  }

  onDateSelection(date: Date) {
    if(date) {
      let selDate = moment(date);
      this.year = selDate.year();
      this.month = selDate.month() + 1;
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

  private getTagGroup(key: string, label: string, value: number, flag?: string): FormGroup {
    return new FormGroup({
      key:    new FormControl(key),
      label:  new FormControl(label),
      value:  new FormControl(value),
      flag:   new FormControl(flag || Flag.M),
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
      this.groupArray.push(this.getTagGroup(groupsList[i].key, groupsList[i].label, 0));
    }
  }

  private loadDailyData() {
    if(this.station && this.year && this.month && this.hour) {

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
    formVal['entry_datetime'] =  new Date().toISOString(),
    formVal['temperature_units'] =  this.f['temperature'].value,
    formVal['precip_units'] =  this.f['precip'].value,
    formVal['cloud_height_units'] = this.f['cloud_height'].value,
    formVal['vis_units'] = this.f['visibility'].value;

    console.log(formVal);
    // this.dataEntryService.addDailyEntry(formVal)
  }

  private updateRecord() {
    // this.dataEntryService.updateDailyEntry(this.station?.station_id, this.element?.element_id, this.year, this.month, this.hour, formVal)
  }

}
