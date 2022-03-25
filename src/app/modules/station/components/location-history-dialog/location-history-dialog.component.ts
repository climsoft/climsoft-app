import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import * as moment from 'moment';

import { getStationTypes, StationType } from './../../../../data/enum/station';
import { StationLocationHistory } from 'src/app/data/interface/station';

@Component({
  selector: 'app-location-history-dialog',
  templateUrl: './location-history-dialog.component.html',
  styleUrls: ['./location-history-dialog.component.scss']
})
export class LocationHistoryDialogComponent implements OnInit {
  @Input() station!: string;
  @Input() historyItem!: StationLocationHistory;
  form!: FormGroup;
  submitted = false;

  stationTypes!: { key: string, value: string }[];
  selectedDate!: Date;

  public onClose: Subject<boolean> = new Subject();

  constructor(private dialogRef: BsModalRef) { }

  ngOnInit(): void {
    // this.form = new FormGroup({
    //   belongs_to: new FormControl(this.station),
    //   station_type: new FormControl(''),
    //   geolocation_method: new FormControl(''),
    //   geolocation_accuracy: new FormControl(null),
    //   opening_datetime: new FormControl(''),
    //   closing_datetime: new FormControl(''),
    //   latitude: new FormControl(null),
    //   longitude: new FormControl(null),
    //   elevation: new FormControl(null),
    //   authority: new FormControl(''),
    //   admin_region: new FormControl(''),
    //   drainage_basin: new FormControl('')
    // });

    this.form = new FormGroup({
      belongs_to: new FormControl(this.station, Validators.required),
      station_type: new FormControl('', Validators.required),
      latitude: new FormControl(null, Validators.required),
      longitude: new FormControl(null, Validators.required),
      geoLocationMethod: new FormControl('', Validators.required),
      geoLocationAccuracy: new FormControl(null, Validators.required),
      opening_datetime: new FormControl(null, Validators.required),
      closing_datetime: new FormControl(null, Validators.required),
      authority: new FormControl('', Validators.required),
      elevation: new FormControl(null, Validators.required),
      admin_region: new FormControl('', Validators.required),
      drainage_basin: new FormControl('', Validators.required)
    });

    if(this.historyItem) {
      this.form.patchValue(this.historyItem);
    }

    this.stationTypes = getStationTypes();
  }

  get update(): boolean {
    return !!this.historyItem;
  }

  onOpeningDateChanged(data: any) {
    this.form.controls['opening_datetime'].setValue(data);
  }

  onClosingDateChanged(data: any) {
    this.form.controls['closing_datetime'].setValue(data);
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

  get f() {
    return this.form.controls;
  }
}
