import { Station } from 'src/app/data/interface/station';
import { PaperArchive } from '@data/interface/paper-archive';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paper-archive-form',
  templateUrl: './paper-archive-form.component.html',
  styleUrls: ['./paper-archive-form.component.scss']
})
export class PaperArchiveFormComponent implements OnInit {
  @Input() archive!: PaperArchive;
  public onClose: Subject<any> = new Subject();
  form!: FormGroup;
  submitted = false;

  station!: Station | undefined;

  constructor(private dialogRef: BsModalRef) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      belongs_to:       new FormControl('', Validators.required),
      form_datetime:    new FormControl('', Validators.required),
      classified_into:  new FormControl('', Validators.required),
      image:            new FormControl('', Validators.required)
    });
  }

  get update(): boolean {
    return !!this.archive;
  }

  get f() {
    return this.form.controls;
  }

  onStationSelect(data: Station) {
    this.station = data;
    this.form.controls['belongs_to'].setValue(data.station_id);
  }

  resetStation() {
    this.station = undefined;
    this.form.controls['station'].reset();
  }

  onFormDateChanged(data: any) {
    this.form.controls['form_datetime'].setValue(data);
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
