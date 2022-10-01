import { StationService } from '@station/services/station.service';
import { catchError, delay, filter, map, tap } from 'rxjs/operators';
import { DataEntryService } from './../../services/data-entry.service';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { IDataEntryForm } from '@data/interface/data-entry-form';

import { Station } from '@data/interface/station';
import { AgroFormGroupComponent } from './../../components/agro-form-group/agro-form-group.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ResponsiveService } from '@shared/services/responsive.service';
import { of, take } from 'rxjs';
import * as moment from 'moment';
import { AgroPayload, AgroState } from '@data/interface/data-entry-agro-payload';
import { ConfirmationComponent } from '@shared/dialogs/confirmation/confirmation.component';
import { Flag } from '@data/enum/flag';

const obsGroups: any = {
  tempRH06GMT:     [101, 102, 103, 105, 2, 3, 99],
  soilTemp05GMT:   [72, 73, 74, 554, 75, 76],
  soilTemp09GMT:   [561, 562, 563],
  windrunRainfall: [513, 5, 504],

  sunshineEvap:    [532, 137, 18, 518],
  tempRH12GMT:     [511, 512, 503, 515],
  soilTemp13GMT:   [564, 565, 566],
  tempRSoilMoist:  [531, 530, 541, 542]
};

// TODO: For future if labels are rendered from API then this model needs to be build from response
const obsList: any = {
  val_101: { element: 101, label: 'Dry Bulb' }, // Temperature dry bulb, TEMPDB
  val_102: { element: 102, label: 'Wet Bulb' }, // Temperature wet bulb, TEMPWB
  val_103: { element: 103, label: 'Dew Point' }, // Temperature dew point, TEMPDP
  val_105: { element: 105, label: 'RH (%)' }, // Relative humidity at 06Z, RELHUM
  val_002: { element:   2, label: 'TMax' }, // Temperature daily maximum, TMPMAX
  val_003: { element:   3, label: 'TMin' }, // Temperature daily minimum, TMPMIN
  val_099: { element:  99, label: 'Grass TMin' }, // Wind Totalizer at 06Z, WINDRUN08
  val_072: { element:  72, label: '005 cm' }, // TT sol 5cm quot, TTS005
  val_073: { element:  73, label: '010 cm' }, // TT sol 10cm quot, TTS010
  val_074: { element:  74, label: '020 cm' }, // TT sol 20cm quot, TTS020
  val_554: { element: 554, label: '030 cm' },// Temperature soil 20 cm at 05Z, SOILT0530
  val_075: { element:  75, label: '050 cm' }, // Temperature soil daily at 50 cm, SOIL50
  val_076: { element:  76, label: '100 cm' }, // Temperature soil daily at 100 cm, SOIL1M
  val_561: { element: 561, label: '005 cm' }, // Temperature soil 5 cm at 09Z, SOILT0905
  val_562: { element: 562, label: '010 cm' }, // Temperature soil 10 cm at 09Z, SOILT0910
  val_563: { element: 563, label: '020 cm' }, // Temperature soil 20 cm at 09Z, SOILT0920
  val_513: { element: 513, label: 'Wind Run (km)' }, // Wind mileage daily, WDRN
  val_005: { element:   5, label: 'Rain Amount (mm)' }, // Precipitation daily total, PRECIP
  val_504: { element: 504, label: 'Rain Duration (hrs)' }, // Precipitation total hours, PRECIPDR
  val_532: { element: 532, label: 'Sun Hrs' }, // Sunshine total hours, SUNHRS
  val_137: { element: 137, label: 'Radiation' }, // Radiation total downward, RADDWN
  val_018: { element:  18, label: 'Evap Pan1' }, // Evaporation pan1 daily total, EVAPPN1
  val_518: { element: 518, label: 'Evap Pan2' }, // Evaporation pan2 daily total, EVAPPN1
  val_511: { element: 511, label: 'Dry Bulb' }, // Temperature dry bulb at 12Z, TEMPDB12
  val_512: { element: 512, label: 'Wet Bulb' }, // Temperature wet bulb at 12Z, TEMPWB12
  val_503: { element: 503, label: 'Dew Point' }, // Temperature dew point at 12Z, TEMPDP12
  val_515: { element: 515, label: 'RH (%)' }, // Relative humidity at 12Z, RELHUM12
  val_564: { element: 564, label: '005 cm' }, // Temperature soil 5 cm at 13Z, SOILT1305
  val_565: { element: 565, label: '010 cm' }, // Temperature soil 10 cm at 13Z, SOILT1310
  val_566: { element: 566, label: '020 cm' }, // Temperature soil 20 cm at 13Z, SOILT1320
  val_531: { element: 531, label: 'TMax Reset' }, // Temperature daily maximum reset, TMPMXRST
  val_530: { element: 530, label: 'TMin Reset' }, // Temperature daily minimum reset, TMPMNRST
  val_541: { element: 541, label: 'Moisture @005cm' }, // Soil Moisture daily at 5 cm, SOILMST005
  val_542: { element: 542, label: 'Moisture @100cm' }, // Soil Moisture daily at 100 cm, SOILMST100
};

@Component({
  selector: 'app-form-agro1',
  templateUrl: './form-agro1.component.html',
  styleUrls: ['./form-agro1.component.scss']
})
export class FormAgro1Component implements OnInit, IDataEntryForm {
  @ViewChildren('agroGroup') agroGroup!: QueryList<AgroFormGroupComponent>;

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
  raw: any;
  hasRecord = false;
  activeItem = 0;

  fieldSets: any[] = [];

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
    this.fieldSets = [
      { field: 'tempRH06GMT', title: 'Temps & RH @ 06GMT' },
      { field: 'soilTemp05GMT', title: 'Soil Temps @ 0500GMT' },
      { field: 'soilTemp09GMT', title: 'Soil Temps @ 0900GMT' },
      { field: 'windrunRainfall', title: '24 Hr Wind Run & Rainfall' },
      { field: 'sunshineEvap', title: 'Sunshine & Evaporation' },
      { field: 'tempRH12GMT', title: 'Temps & RH @ 12GMT' },
      { field: 'soilTemp13GMT', title: 'Soil Temps @ 1300GMT' },
      { field: 'tempRSoilMoist', title: 'Temp Reset & Soil Moisture' },
    ];

    this.dataEntryService.agroState
        .pipe(
          tap((st) => this.loading = !!st),
          filter(st => !!st),
          take(1)
        )
        .subscribe((st: AgroState) => {
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
    return this.agroGroup.toArray().filter(gp => !!gp.isDirty).length > 0;
  }

  get invalidEntries(): boolean {
    return this.agroGroup.toArray().filter(gp => !!gp.isInvalid).length > 0;
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
    this.loadAgroData();
  }

  onDateSelection(date: Date) {
    if(date) {
      this.date = date;
      let selDate = moment(date);
      this.year = selDate.year();
      this.month = selDate.month() + 1;
      this.day = selDate.date();
      this.loadAgroData();
    }
  }

  onReset() {
    this.form.reset();
    this.initForm();
  }

  onCancel() {}

  onReturn(e: Event) {
    e.preventDefault();
  }

  onSubmit(e: Event): any {
    this.submitted = true;
    // if(this.form.invalid) {
    //   return false;
    // }
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

    const payload = this.buildPayload();
    this.hasRecord ? this.update(payload) : this.save(payload);
  }

  groupArray(group: string): FormArray {
    return this.form.get(group) as FormArray;
  }

  formGroups(group: string): FormGroup[] {
    return this.groupArray(group).controls as FormGroup[];
  }

  keyFocus(i: number) {
    this.activeItem = i;
  }

  keyBlur(d: number) {}

  handleReturn(idx: number) {
    const total = this.agroGroup.toArray().length;
    if(idx < total - 1) {
      this.agroGroup.toArray()[idx + 1].focusValue();
    }
  }

  getFieldsetGroupArray(group: string): FormArray {
    return this.form.get(group) as FormArray;
  }

  getFieldsetGroupControls(group: string): FormGroup[] {
    return this.getFieldsetGroupArray(group).controls as FormGroup[];
  }

  revertItem(idx: number) {
    const config = {
      title: `Confirm Revert`,
      message: `Are you sure you want to revert to original values?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    dialogRef.content.onClose.subscribe((opt: boolean) => {
      if(opt) {
        const target = this.agroGroup
                             .filter((g) => g.group.value.index === idx)
                             .map((g) => g.group.value)[0];
        const obsIndex = obsGroups[target.group].indexOf(target.element);
        if(this.hasRecord) {
          const target = this.agroGroup
                             .filter((g) => g.group.value.index === idx)
                             .map((g) => g.group.value)[0];

          const val = this.raw[`val_elem${this.formatEl(target.element)}`];
          const flag = this.raw[`flag${this.formatEl(target.element)}`];
          this.getFieldsetGroupControls(target.group)[obsIndex] = this.getElementGroup(target.group, idx, target.element, target.label, val, flag);
        } else {
          this.getFieldsetGroupControls(target.group)[obsIndex] = this.getElementGroup(target.group, idx, target.element, target.label, 0, Flag.N);
        }
      }
    });
  }

  private getElementGroup(group: string, index: number, element: number, label: string, value: any, flag: string, ): FormGroup {
    return new FormGroup({
      group:    new FormControl(group),
      index:    new FormControl(index),
      element:  new FormControl(element),
      label:    new FormControl(label),
      value:    new FormControl(value),
      flag:     new FormControl(flag || Flag.N)
    });
  }

  private initForm() {
    this.form = new FormGroup({
      station:         new FormControl(null, Validators.required),
      dayMonthYear:    new FormControl(new Date(), Validators.required),
      // tempRH06GMT:     new FormArray([]),
      // tempRH12GMT:     new FormArray([]),
      // soilTemp05GMT:   new FormArray([]),
      // soilTemp09GMT:   new FormArray([]),
      // soilTemp13GMT:   new FormArray([]),
      // sunshineEvap:    new FormArray([]),
      // windrunRainfall: new FormArray([]),
      // tempRSoilMoist:  new FormArray([])
    });
    this.initFieldsets();
  }

  private initFieldsets() {
    this.form.controls['tempRH06GMT'] =     new FormArray([]);
    this.form.controls['tempRH12GMT'] =     new FormArray([]);
    this.form.controls['soilTemp05GMT'] =   new FormArray([]);
    this.form.controls['soilTemp09GMT'] =   new FormArray([]);
    this.form.controls['soilTemp13GMT'] =   new FormArray([]);
    this.form.controls['sunshineEvap'] =    new FormArray([]);
    this.form.controls['windrunRainfall'] = new FormArray([]);
    this.form.controls['tempRSoilMoist'] =  new FormArray([]);

    let idx = 0;
    Object.keys(obsGroups).forEach((k) => {
      obsGroups[k].forEach((el: number) => {
        const target = obsList[`val_${this.formatEl(el)}`];
        this.groupArray(k).push(this.getElementGroup(k, idx, el, target.label, 0, Flag.N));
        idx++;
      });
    });
  }

  private setFormState(station: number, date: Date) {
    this.monthYearValue = date;
    this.stationService.getStation(station)
        .subscribe((res) => {
          this.station = res.result[0];
          this.form.controls['station'].setValue(this.station?.station_id);
          this.loadAgroData();
        });
  }

  private loadAgroData() {
    this.initFieldsets();
    console.log(this.station, this.year, this.month, this.day);
    if(this.station && this.year && this.month && this.day) {
      this.loading = true;
      this.dataEntryService.getAgroEntry(this.station.station_id, this.year, this.month, this.day)
          .pipe(
            catchError((err) => {
              this.loading = false;
              return of(err)
            }),
            tap((res: any) => { this.hasRecord = res.result && res.result.length > 0 }),
            filter((res: any) => res.result && res.result.length),
            map((res: any) => res.result[0])
          )
          .subscribe(data => {
            console.log(data);
            this.raw = { ...data };
            this.patchForm(data);
            this.loading = false;
            this.focusFirst();
          });
    }
  }

  private patchForm(data: any) {
    this.agroGroup.forEach((fg, i) => {
      const groupVal = { ...fg.group.value };
      const patchValue = {
        index: i,
        value: data[`val_elem${this.formatEl(groupVal.element)}`],
        flag: data[`flag${this.formatEl(groupVal.element)}`]
      };
      fg.group.patchValue({ ...patchValue });
    });
  }

  private save(payload: AgroPayload) {
    if(payload.mm) {
      payload.mm = payload.mm + 1;
    }
    payload['entry_datetime'] =  new Date();
    console.log(payload);
    this.dataEntryService.addAgroEntry(payload).subscribe((res) => {
      console.log(res);
      this.form.markAsPristine();
    });
  }

  private update(payload: AgroPayload) {
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
      this.dataEntryService.updateAgroEntry(this.station.station_id, yyyy, mm, dd, payload).subscribe((res) => {
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

  private buildPayload(): AgroPayload {
    const mom = moment(this.date);
    const payload: any = {
      station_id: this.station?.station_id,
      yyyy: mom.year(),
      mm: mom.month(),
      dd: mom.date(),
      signature: '',
      entry_datetime: new Date()
    };
    this.agroGroup.forEach(fg => {
      const target = { ...fg.group.value };
      payload[`val_elem${this.formatEl(target.element)}`] = target.value;
      payload[`flag${this.formatEl(target.element)}`] = target.flag;
    });

    return { ...payload };
  }

  private focusFirst() {
    of(true)
      .pipe(delay(100))
      .subscribe(() => {
        this.agroGroup.toArray()[0].focusValue();
      });
  }

}
