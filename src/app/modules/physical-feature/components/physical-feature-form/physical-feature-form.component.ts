import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, tap, switchMap, catchError, filter } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { ImageUploaderComponent } from './../../../../shared/component/image-uploader/image-uploader.component';
import { Station } from 'src/app/data/interface/station';
import { PhysicalFeature } from './../../../../data/interface/physical-features';

@Component({
  selector: 'app-physical-feature-form',
  templateUrl: './physical-feature-form.component.html',
  styleUrls: ['./physical-feature-form.component.scss']
})
export class PhysicalFeatureFormComponent implements OnInit {
  @Input() feature!: PhysicalFeature | undefined;
  @ViewChild('imageUploader') imageUploader!: ImageUploaderComponent;

  public onClose: Subject<boolean> = new Subject();

  form!: FormGroup;
  submitted = false;
  error!: string;

  bsValue!: Date;
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'DD/MM/YYYY'
  };

  station!: Station | undefined;

  constructor(private dialogRef: BsModalRef) { }

  get update(): boolean {
    return !!this.feature;
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      associated_with: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
      classified_into: new FormControl(null, Validators.required),
      image: new FormControl(null),
      begin_date: new FormControl(null, Validators.required),
      end_date: new FormControl(null, Validators.required)
    });

    if(this.feature) {
      this.form.patchValue({ ...this.feature });
    }
  }

  resetStation() {
    this.station = undefined;
    this.form.controls['associated_with'].reset();
  }

  onStationSelect(data: Station) {
    this.station = data;
    this.form.controls['associated_with'].setValue(data.station_id);
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

  onImage(data: any) {
    console.log(data);
  }

  public onSubmit(e: Event): void {
    console.log(this.form.value);
    this.error = '';
    this.submitted = true;
    if(this.form.invalid) {
      return;
    }

    this.imageUploader.upload().pipe(
      catchError((err) => {
        this.error = 'Image upload failed';
        throw new Error(err.nessage);
      }),
      filter((body: any) => body.result && body.result.length)
    ).subscribe((res: any) => {
      this.form.controls['image'].setValue(res.result[0].filepath);
      this.onClose.next(this.form.value);
      this.dialogRef.hide();
    });
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.dialogRef.hide();
  }

}
