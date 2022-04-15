import { Station } from 'src/app/data/interface/station';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PhysicalFeatureClass } from './../../../../data/interface/physical-features';
import { Subject } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-feature-class-form',
  templateUrl: './feature-class-form.component.html',
  styleUrls: ['./feature-class-form.component.scss']
})
export class FeatureClassFormComponent implements OnInit {
  @Input() featureClass!: PhysicalFeatureClass;
  form!: FormGroup;
  submitted = false;

  stationTypes!: { key: string, value: string }[];
  selectedDate!: Date;

  station!: Station | undefined;

  public onClose: Subject<boolean> = new Subject();

  constructor(private dialogRef: BsModalRef) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      feature_class: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      refers_to: new FormControl('', Validators.required)
    });

    if(this.featureClass) {
      this.form.patchValue(this.featureClass);
    }
  }

  get update(): boolean {
    return !!this.featureClass;
  }

  get f() {
    return this.form.controls;
  }

  onStationSelect(data: Station) {
    this.station = data;
    this.form.controls['refers_to'].setValue(data.station_id);
  }

  resetStation() {
    this.station = undefined;
    this.form.controls['station'].reset();
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
}
