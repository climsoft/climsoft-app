import { ElementLimits } from '@data/interface/data-entry-form';
import { ConfirmationComponent } from '@shared/dialogs/confirmation/confirmation.component';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { DataEntryService } from './../../services/data-entry.service';
import { StationService } from '@station/services/station.service';
import { ElementService } from '@element/services/element.service';
import { MonthlyRecord } from './../../../../data/interface/data-entry-form';
import { ResponsiveService } from '@shared/services/responsive.service';
import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { Flag } from '@data/enum/flag';
import { ObsElement } from '@data/interface/element';
import { Station } from '@data/interface/station';
import * as moment from 'moment';
import { MonthFormGroupComponent } from '../../components/month-form-group/month-form-group.component';
import { filter, take, tap, switchMap, of, delay } from 'rxjs';


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
  limits!: ElementLimits | null;

  yearValue: number = new Date().getFullYear();
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'YYYY'
  };
  date!: Date;
  monthsList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  hasRecord = false;
  raw: any;
  month: number = 0;

  @ViewChildren('monthlyGroup') monthlyGroup!: QueryList<MonthFormGroupComponent>;

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
    // this.responsiveSvc.screenSize.subscribe(x => {
    //   console.log(x);
    //   // this.size = x;
    // });

    this.dataEntryService.monthlyState
        .pipe(
          tap((st) => this.loading = !!st),
          filter(st => !!st),
          take(1)
        )
        .subscribe((st) => {
          this.initForm(new Date(st.year).getFullYear());
          this.setFormState(+st.station, +st.element, new Date(st.year).getFullYear());
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

  get hasChanges(): boolean {
    return this.monthlyGroup.toArray().filter((gp) => gp.isDirty === true).length > 0;
  }

  get invalidEntries(): boolean {
    return this.monthlyGroup.toArray().filter(gp => !!gp.isInvalid).length > 0;
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
    this.loadMonthlyData();
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
    this.loadMonthlyData();
  }

  onSubmit(e: Event) {
    this.submitted = true;
    if(this.form.invalid && !this.f['months'].invalid) {
      return;
    }

    if(this.invalidEntries) {
      this.error = 'The monthly data contains some invalid entries, please fix the items and try again.'
      return;
    }
    console.log(+this.f['total'].value, this.calcTotal, +this.f['total'].value === this.calcTotal);
    if(+this.f['total'].value !== this.calcTotal) {
      this.error = `The days based data total does not match with the total provided, please check the values and try again.`;
      return;
    }

    this.error = '';
    this.hasRecord ? this.updateRecord() : this.addRecord();
  }

  yearSelect(e: any) {
    this.f['yyyy'].setValue(e);
    this.renderFormMonths(e);
    this.loadMonthlyData();
  }

  onReset() {
    this.form.reset();
    this.initForm();
  }

  onCancel() {}

  onReturn(e: Event) {
    e.preventDefault();
  }

  getDateText() {
    return moment(this.date).format('YYYY');
  }

  get monthsArray(): FormArray {
    return this.form.get('months') as FormArray;
  }

  get formMonthGroups(): FormGroup[] {
    return this.monthsArray.controls as FormGroup[];
  }

  get calcTotal(): number {
    if(!this.monthlyGroup) {
      return 0;
    }
    return this.monthlyGroup.toArray().reduce((ac, g) => {
      const val: number = g.group.value.value? +g.group.value.value : 0;
      return ac = val + ac;
    }, 0);
  }

  monthFocus(m: number) {
    this.month = m;
  }

  monthBlur(d: number) {}

  handleReturn(d: number) {
    const total = this.monthlyGroup.toArray().length;
    if(+d < total) {
      this.monthlyGroup.toArray()[+d].focusValue();
    }
  }

  revertMonth(month: number) {
    console.log(month);
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
          const postFix = (month<10? '0' : '') + month;
          const value = this.raw[`mm_${postFix}`];
          const flag = this.raw[`flag${postFix}`];
          const period = this.raw[`period${postFix}`];
          this.formMonthGroups[month-1] = this.getMonthGroup({ month, value, flag, period });
        } else {
          this.formMonthGroups[month-1] = this.getMonthGroup({});
        }
      }
    });
  }

  private getMonthGroup(data?: any): FormGroup {
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
    for(let i of this.monthsList) {
      const period = moment(`${year}-${i}}`, "YYYY-MM").daysInMonth();
      const monthText = moment(`${year}-${i}`, "YYYY-MM").format('MMMM');
      this.monthsArray.push(this.getMonthGroup({ month: monthText, value: null, flag: Flag.M, period: period }));
    }
  }

  private resetMonths() {
    this.form.controls['months'] = new FormArray([]);
  }

  private initForm(year: number = new Date().getFullYear()) {
    this.form = new FormGroup({
      station:  new FormControl(null, Validators.required),
      element:  new FormControl(null, Validators.required),
      yyyy:     new FormControl(year, Validators.required),
      months:   new FormArray([]),
      total:    new FormControl(0)
    });
  }

  private setFormState(station: number, element: number, year: number) {
    this.stationService.getStation(station)
        .pipe(
          tap((res) => {
            this.station = res.result[0]
          }),
          switchMap((res) => this.elementService.getElement(element))
        )
        .subscribe((res) => {
          this.element = res.result[0];
          this.f['station'].setValue(station);
          this.f['element'].setValue(element);
          this.f['yyyy'].setValue(year);
          this.yearValue = +year;

          this.loadMonthlyData();
        });
  }

  private loadMonthlyData() {
    if(this.station && this.element && this.yearValue) {
      this.loading = true;
      this.dataEntryService.getMonthlyEntry(this.station.station_id, this.element.element_id, this.f['yyyy'].value)
          .subscribe((res) => {
            console.log(res);
            this.hasRecord = res.result.length > 0;
            if(res.result.length) {
              this.raw = res.result[0];
              this.renderFormMonths(this.yearValue);
              this.patchForm(res.result[0]);
            } else {
              this.resetMonths();
              this.renderFormMonths(this.yearValue);
              this.f['total'].setValue(0);
              this.focusFirst();
            }

            this.loading = false;
            // if(this.monthlyGroup) {
            //   this.monthlyGroup.toArray()[0].group['value'].focus();
            // }
          });
    }
  }

  private patchForm(data: any) {
    let total = 0;
    this.formMonthGroups.forEach((g, i) => {
      const num = (i+1 < 10) ? `0${i+1}` : (i+1);
      const monthText = moment(`${this.yearValue}-${i+1}`, "YYYY-MM").format('MMMM');
      const patchValue = {
        month: monthText,
        value: data[`mm_${num}`],
        flag: data[`flag${num}`] || Flag.N,
        period: data[`period${num}`]
      };
      g.patchValue({ ...patchValue });
      total += +data[`mm_${num}`];
    });
    this.f['total'].setValue(total || 0);
    this.focusFirst();
  }

  private addRecord() {
    let formVal: any = this.buildPayload();
    console.log(formVal);

    if(!this.hasChanges) {
      alert('You must enter a few values');
    }
    this.dataEntryService.addMonthlyEntry(formVal).subscribe();
  }

  private updateRecord() {
    let formVal: any = this.buildPayload();
    console.log(formVal);

    if(!this.hasChanges) {
      alert('You must enter a few values');
    }
    this.dataEntryService.updateMonthlyEntry(this.station?.station_id, this.element?.element_id, this.f['yyyy'].value, formVal).subscribe();
  }

  private buildPayload(): any {
    const payload: any = {
      stationId: this.station?.station_id,
      elementId: this.element?.element_id,
      yyyy: +this.f['yyyy'].value,
      signature: '',
      entry_datetime: new Date()
    };
    const formVal = this.form.value;
    console.log(formVal);
    formVal.months = this.formMonthGroups.map(fg => ({ ...fg.value, flag: fg.value.flag || null }));
    let i = 1;
    for(let m of formVal.months) {
      const post = i < 10 ? `0${i}` : `${i}`;
      payload[`mm_${post}`] = m.value;
      payload[`flag${post}`] = m.flag || null;
      payload[`period${post}`] = m.period;
      i++;
    }

    return payload;
  }

  private focusFirst() {
    of(true)
      .pipe(delay(100))
      .subscribe(() => {
        this.monthlyGroup.toArray()[0].focusValue();
      });
  }
}
