import { ConfirmationComponent } from '@shared/dialogs/confirmation/confirmation.component';
import { StationService } from './../../../station/services/station.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, tap, switchMap, catchError, filter, map } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { ImageUploaderComponent } from './../../../../shared/component/image-uploader/image-uploader.component';
import { Station } from 'src/app/data/interface/station';
import { PhysicalFeature, PhysicalFeatureClass } from './../../../../data/interface/physical-features';
import { PhysicalFeaturesService } from '@physical-feature/services/physical-features.service';
import * as moment from 'moment';

@Component({
  selector: 'app-physical-feature-form',
  templateUrl: './physical-feature-form.component.html',
  styleUrls: ['./physical-feature-form.component.scss']
})
export class PhysicalFeatureFormComponent implements OnInit {
  @Input() feature!: PhysicalFeature | undefined;
  @Input() fromStation!: number;
  @ViewChild('imageUploader') imageUploader!: ImageUploaderComponent;

  public onClose: Subject<boolean> = new Subject();

  form!: FormGroup;
  submitted = false;
  error!: string;

  beginDate!: Date;
  endDate!: Date;
  minDate!: Date;

  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'DD/MM/YYYY'
  };

  station!: Station | undefined;
  featureClasses: PhysicalFeatureClass[] = [];

  updateImg = false;

  constructor(
      private modalService: BsModalService,
      private dialogRef: BsModalRef,
      private featureService: PhysicalFeaturesService,
      private stationService: StationService
    ) { }

  get update(): boolean {
    return !!this.feature;
  }

  get f() {
    return this.form.controls;
  }

  get imageSrc(): string {
    return `climsoft/${this.feature?.image}`;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      associated_with: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      classified_into: new FormControl({ value: '', disabled: true }, Validators.required),
      image: new FormControl(null),
      begin_date: new FormControl(null, Validators.required),
      end_date: new FormControl(null, Validators.required)
    });

    if(this.feature) {
      this.loadFeatureClasses(+this.feature.associated_with);
      this.form.patchValue({ ...this.feature });
      this.beginDate = new Date(this.feature.begin_date);
      this.endDate = new Date(this.feature.end_date);
      this.initStation(+this.feature.associated_with);
    }

    if(this.fromStation) {
      this.form.controls['associated_with'].setValue(+this.fromStation);
      this.initStation(+this.fromStation);
      this.loadFeatureClasses(+this.fromStation);
    }
  }

  resetStation() {
    this.station = undefined;
    this.f['associated_with'].reset();
    this.f['classified_into'].setValue('');
    this.f['classified_into'].disable();
    this.featureClasses = [];
  }

  onStationSelect(data: Station) {
    const { station_id } = data;
    this.station = data;
    if(station_id) {
      this.form.controls['associated_with'].setValue(station_id);
      this.f['classified_into'].setValue('');
      this.loadFeatureClasses(station_id);
    }
  }

  onBeginDateChanged(data: Date) {
    if(data) {
      this.form.controls['begin_date'].setValue(data.toISOString());
      this.minDate = moment(data).add(1, 'days').toDate();
    }
  }

  onEndDateChanged(data: Date) {
    if(data) {
      this.form.controls['end_date'].setValue(data.toISOString());
    }
  }

  onImage(data: any) {
    console.log(data);
  }

  replaceImage() {
    const config = {
      title: `Replace Image`,
      message: `The image will be replaced with selected image. Are you sure you want to continue?`,
      confirm: 'Yes',
      cancel: 'No'
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    dialogRef.content.onClose.subscribe((opt: boolean) => {
      this.updateImg = opt;
      this.f['image'].setValue(null);
    });
  }

  public onSubmit(e: Event): void {
    console.log(this.form.value);
    this.error = '';
    this.submitted = true;
    if(this.form.invalid) {
      return;
    }

    this.update? this.updateFeature() : this.addNew();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.dialogRef.hide();
  }

  private addNew() {
    this.imageUploader.upload().pipe(
      catchError((err) => {
        this.error = 'Image upload failed';
        throw new Error(err.nessage);
      }),
      filter((body: any) => body.result && body.result.length)
    ).subscribe((res: any) => {
      this.form.controls['image'].setValue(res.result[0].filepath);
      this.onClose.next(this.form.value);
    });
  }

  private updateFeature() {
    if(this.updateImg) {
      this.imageUploader.upload().pipe(
        catchError((err) => {
          this.error = 'Image upload failed';
          throw new Error(err.nessage);
        }),
        filter((body: any) => body.result && body.result.length)
      ).subscribe((res: any) => {
        this.form.controls['image'].setValue(res.result[0].filepath);
        this.onClose.next(this.form.value);
      });
    } else {
      const payload = { ...this.form.value };
      delete payload.image;
      this.onClose.next(payload);
    }
  }

  private loadFeatureClasses(station_id: number) {
    this.featureService.getStationFeatureClasses(station_id).subscribe((list: any[]) => {
      this.featureClasses = list;
      this.f['classified_into'].enable();
    });
  }

  private initStation(station_id: number) {
    this.stationService.getStation(station_id)
    .pipe(
      tap((res) => console.log(res)),
      filter(res => res.result.length),
      map(res => res.result[0])
    )
    .subscribe((st) => {
      console.log(st);
      this.station = st;
    });
  }

}
