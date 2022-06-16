import { TimeZone } from './../../../../data/interface/timezone';
import { Station } from 'src/app/data/interface/station';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { Qualifier } from 'src/app/data/interface/qualifier';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-qualifier-form',
  templateUrl: './qualifier-form.component.html',
  styleUrls: ['./qualifier-form.component.scss']
})
export class QualifierFormComponent implements OnInit {
  @Input() qualifier!: Qualifier | undefined;
  @Input() fromStation!: Station | undefined;

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
  minDate!: Date;

  station!: Station | undefined;

  constructor(private dialogRef: BsModalRef) { }

  get update(): boolean {
    return !!this.qualifier;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      belongs_to: new FormControl(null, Validators.required),
      qualifier: new FormControl('', Validators.required),
      qualifier_begin_date: new FormControl(null, Validators.required),
      qualifier_end_date: new FormControl(null, Validators.required),
      station_timezone: new FormControl('', Validators.required),
      station_network_type: new FormControl(null, Validators.required)
    });

    if(this.fromStation) {
      console.log(this.fromStation);
      this.form.controls['belongs_to'].setValue(this.fromStation.station_id);
      this.station = this.fromStation;
    }

    if(this.qualifier) {
      console.log(this.qualifier);
      this.form.patchValue({ ...this.qualifier });
      this.bsBegin = new Date(this.qualifier.qualifier_begin_date);
      this.minDate = moment(this.qualifier.qualifier_begin_date).startOf('day').add(1, 'day').toDate();
      this.bsEnd = new Date(this.qualifier.qualifier_end_date);
    }
  }

  resetStation() {
    this.station = undefined;
    this.form.controls['belongs_to'].reset();
  }

  onStationSelect(data: Station) {
    this.station = data;
    this.form.controls['belongs_to'].setValue(data.station_id);
  }

  onBeginDateChanged(data: Date) {
    if(data) {
      this.form.controls['qualifier_begin_date'].setValue(data.toISOString());
      this.minDate = moment(data).startOf('day').add(1, 'day').toDate();
    }
  }

  onEndDateChanged(data: Date) {
    if(data) {
      this.form.controls['qualifier_end_date'].setValue(data.toISOString());
    }
  }

  onTimezoneSelect(zone: TimeZone) {
    this.form.controls['station_timezone'].setValue(zone.offset);
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
