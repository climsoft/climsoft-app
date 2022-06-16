import { ElementService } from '@element/services/element.service';
import { InstrumentService } from './../../../instrument/services/instrument.service';
import { StationService } from '@station/services/station.service';
import { ScheduleClass } from '@data/interface/schedule-class';
import { ScheduleClassService } from './../../../schedule-class/services/schedule-class.service';
import { Instrument } from 'src/app/data/interface/instrument';
import { ObsElement } from 'src/app/data/interface/element';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Station, StationElement } from '@data/interface/station';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subject, tap, switchMap } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-station-element-form',
  templateUrl: './station-element-form.component.html',
  styleUrls: ['./station-element-form.component.scss']
})
export class StationElementFormComponent implements OnInit {
  @Input() stationElement!: StationElement;
  @Input() fromStation!: Station;

  public onClose: Subject<boolean> = new Subject();

  form!: FormGroup;
  submitted = false;
  loading = false;

  bsBegin!: Date;
  bsEnd!: Date;
  minDate!: Date;
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'DD/MM/YYYY'
  };
  station!: Station | undefined;
  element!: ObsElement | undefined;
  instrument!: Instrument | undefined;

  scheduleClasses: ScheduleClass[] = [];

  constructor(
      private dialogRef: BsModalRef,
      private stationService: StationService,
      private instrumentService: InstrumentService,
      private obsElService: ElementService,
      private schClassService: ScheduleClassService) {}

  get update(): boolean {
    return !!this.stationElement;
  }

  ngOnInit(): void {
    console.log(this.stationElement);

    this.form = new FormGroup({
      recorded_from:  new FormControl(null, Validators.required),
      described_by:   new FormControl(null, Validators.required),
      recorded_with:  new FormControl(null, Validators.required),
      scheduled_for:  new FormControl({ value: '', disabled: true }, Validators.required),
      begin_date:     new FormControl(null, Validators.required),
      end_date:       new FormControl(null),
      height:         new FormControl(null, Validators.required)
    });

    if(this.fromStation) {
      this.form.controls['recorded_from'].setValue(this.fromStation.station_id);
      this.station = this.fromStation;
      this.loadScheduleClasses(this.station.station_id);
    }

    if(this.stationElement) {
      this.loadDependencies();
    }
  }

  resetStation() {
    this.station = undefined;
    this.form.controls['recorded_from'].reset();
  }

  onStationSelect(data: Station) {
    this.station = data;
    this.form.controls['recorded_from'].setValue(data.station_id);
    this.loadScheduleClasses(this.station.station_id);
    this.f['scheduled_for'].setValue('');
    this.f['scheduled_for'].disable();
  }

  resetElement() {
    this.element = undefined;
    this.form.controls['described_by'].reset();
  }

  onElementSelect(data: ObsElement) {
    this.element = data;
    this.form.controls['described_by'].setValue(data.element_id);
  }

  resetInstrument() {
    this.element = undefined;
    this.form.controls['recorded_with'].reset();
  }

  onInstrumentSelect(data: Instrument) {
    this.instrument = data;
    this.form.controls['recorded_with'].setValue(data.instrument_id);
  }

  onBeginDateChanged(data: Date) {
    if(data) {
      this.form.controls['begin_date'].setValue(data.toISOString());
      this.minDate = moment(data).add(1, 'day').toDate();
    }
  }

  onEndDateChanged(data: Date) {
    if(data) {
      this.form.controls['end_date'].setValue(data.toISOString());
    }
  }

  public onSubmit(e: Event): void {
    console.log(this.form.value);
    this.submitted = true;
    if(this.form.invalid) {
      return;
    }
    this.onClose.next(this.form.value);
    this.dialogRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.dialogRef.hide();
  }

  get f() {
    return this.form.controls;
  }

  private loadScheduleClasses(id: any) {
    this.scheduleClasses = [];
    this.schClassService.getByStation(id).subscribe((res: any) => {
      this.scheduleClasses = res.result;
      this.f['scheduled_for'].enable();
    });
  }

  private loadDependencies() {
    this.loading = true;
    this.loadScheduleClasses(this.stationElement.recorded_from);
    this.stationService.getStation(+this.stationElement.recorded_from)
      .pipe(
        tap((res) => this.station = res.result[0]),
        switchMap(() => this.obsElService.getElement(this.stationElement.described_by))
      )
      .pipe(
        tap((res) => this.element = res.result[0]),
        switchMap(() => this.instrumentService.getInstrument(+this.stationElement.recorded_with))
      )
      .subscribe((res: any) => {
        this.instrument = res.result[0];
        this.loading = false;
      })
    this.form.patchValue({ ...this.stationElement });
    this.bsBegin = new Date(this.stationElement.begin_date);
  }
}
