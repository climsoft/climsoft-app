import { Station } from 'src/app/data/interface/station';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Instrument } from './../../../../data/interface/instrument';
import { ObsElement } from './../../../../data/interface/element';
import { StationElement } from './../../../../data/interface/station';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject, Observable } from 'rxjs';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import * as moment from 'moment';

@Component({
  selector: 'app-station-element-dialog',
  templateUrl: './station-element-dialog.component.html',
  styleUrls: ['./station-element-dialog.component.scss']
})
export class StationElementDialogComponent implements OnInit {
  @Input() station!: Station;
  @Input() stationElement?: StationElement;
  form!: FormGroup;

  submitted = false;
  beginDate!: Date;
  endDate!: Date;
  minDate!: Date;
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'DD/MM/YYYY'
  };

  descBy!: string;
  instrument: Instrument | undefined;

  public onClose: Subject<boolean> = new Subject();

  constructor(private dialogRef: BsModalRef) { }

  ngOnInit(): void {
    console.log(this.station);

    //   this.form = new FormGroup({
    //     recorded_from:  new FormControl(this.station),
    //     recorded_with:  new FormControl(''),
    //     described_by:   new FormControl(null),
    //     height:         new FormControl(null),
    //     begin_date:     new FormControl(''),
    //     end_date:       new FormControl(''),
    //     instrument_code:new FormControl(null),
    //     scheduled_for:  new FormControl('')
    //   });
    // }

    this.form = new FormGroup({
      recorded_from:  new FormControl(this.station, Validators.required),
      recorded_with:  new FormControl(null),
      described_by:   new FormControl(null, Validators.required),
      height:         new FormControl(null),
      begin_date:     new FormControl('', Validators.required),
      end_date:       new FormControl(null),
      instrument_code:new FormControl(null),
      scheduled_for:  new FormControl(null)
    });

    if(this.stationElement) {
      this.form.patchValue(this.stationElement);
      if(this.stationElement.begin_date) {
        this.beginDate = new Date(this.stationElement.begin_date);
      }
      if(this.stationElement.end_date) {
        this.endDate = new Date(this.stationElement.end_date);
      }
    } else {
      this.beginDate = new Date();
      this.endDate = new Date();
    }
  }

  get update(): boolean {
    return !!this.stationElement;
  }

  public onSubmit(e: Event): void {
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

  resetDescBy() {
    this.descBy = '';
    this.f['described_by'].reset();
  }

  onElementSelect(data: ObsElement) {
    this.descBy = data.element_name;
    this.f['described_by'].setValue(data.element_id);
  }


  resetInst() {
    this.instrument = undefined;
    this.f['instrument_code'].reset();
  }

  onInstSelect(data: Instrument) {
    this.instrument = data;
    this.f['instrument_code'].setValue(data.serial_number);
  }

  onBeginDateChanged(data: Date) {
    if(data) {
      console.log(data);
      this.f['begin_date'].setValue(data);
      this.minDate = moment(data).add(1, 'day').toDate();
    }
  }

  onEndDateChanged(data: Date) {
    if(data) {
      this.f['end_date'].setValue(data);
    }
  }

  get f() {
    return this.form.controls;
  }
}
