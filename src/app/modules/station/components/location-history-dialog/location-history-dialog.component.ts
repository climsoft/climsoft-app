import { StationService } from '@station/services/station.service';
import { Station } from '@data/interface/station';
import { Component, OnInit, Input } from '@angular/core';
import { Subject, filter, map } from 'rxjs';
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
  @Input() fromStation!: string;
  @Input() historyItem!: StationLocationHistory;
  form!: FormGroup;
  submitted = false;

  stationTypes!: { key: string, value: string }[];
  selectedDate!: Date;

  openDate!: Date;
  closeDate!: Date;
  minDate!: Date;

  station!: Station | undefined;

  public onClose: Subject<boolean> = new Subject();

  constructor(private dialogRef: BsModalRef, private stationService: StationService) { }

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
      belongs_to: new FormControl(null, Validators.required),
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
      this.openDate = new Date(this.historyItem.opening_datetime);
      this.minDate = moment(this.historyItem.opening_datetime).add(1, 'day').toDate();
      this.closeDate = new Date(this.historyItem.closing_datetime);
    } else {
      this.f['opening_datetime'].setValue(moment().subtract(3, 'months').toDate());
      this.f['closing_datetime'].setValue(new Date());
    }

    if(this.fromStation) {
      this.f['belongs_to'].setValue(this.fromStation);
    }
    if(this.historyItem) {
      this.initStation(+this.historyItem.belongs_to);
    }

    this.stationTypes = getStationTypes();
  }

  get update(): boolean {
    return !!this.historyItem;
  }

  resetStation() {
    this.station = undefined;
    this.form.controls['belongs_to'].reset();
  }

  onStationSelect(data: Station) {
    this.station = data;
    this.form.controls['belongs_to'].setValue(data.station_id);
  }

  onOpeningDateChanged(data: any) {
    this.form.controls['opening_datetime'].setValue(data);
    this.minDate = moment(data).add(1, 'day').toDate();
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

  private initStation(id: number) {
    this.stationService.getStation(id).pipe(
      filter(res => res.result.length),
      map(res => res.result[0])
    ).subscribe((st) => {
      this.station = st;
    });
  }
}
