import { Instrument } from 'src/app/data/interface/instrument';
import { ObsElement } from 'src/app/data/interface/element';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Station, StationElement } from '@data/interface/station';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Subject } from 'rxjs';

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

  bsBegin!: Date;
  bsEnd!: Date;
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'DD/MM/YYYY'
  };
  station!: Station | undefined;
  element!: ObsElement | undefined;
  instrument!: Instrument | undefined;

  constructor(private dialogRef: BsModalRef) { }

  get update(): boolean {
    return !!this.stationElement;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      recorded_from:  new FormControl(null, Validators.required),
      described_by:   new FormControl(null, Validators.required),
      recorded_with:  new FormControl(null, Validators.required),
      begin_date:     new FormControl(null, Validators.required),
      end_date:       new FormControl(null, Validators.required),
      height:         new FormControl(null, Validators.required),
      scheduled_for:  new FormControl(null, Validators.required)
    });

    if(this.fromStation) {
      this.form.controls['recorded_from'].setValue(this.fromStation.station_id);
      this.station = this.fromStation;
    }

    if(this.stationElement) {
      this.form.patchValue({ ...this.stationElement });
    }
  }

  resetStation() {
    this.station = undefined;
    this.form.controls['recorded_from'].reset();
  }

  onStationSelect(data: Station) {
    this.station = data;
    this.form.controls['recorded_from'].setValue(data.station_id);
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
}
