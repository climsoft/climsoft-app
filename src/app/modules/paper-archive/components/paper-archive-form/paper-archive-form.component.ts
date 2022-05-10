import { catchError, filter } from 'rxjs/operators';
import { ImageUploaderComponent } from './../../../../shared/component/image-uploader/image-uploader.component';
import { PaperArchiveDefinition } from './../../../../data/interface/paper-archive';
import { Station } from 'src/app/data/interface/station';
import { PaperArchive } from '@data/interface/paper-archive';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-paper-archive-form',
  templateUrl: './paper-archive-form.component.html',
  styleUrls: ['./paper-archive-form.component.scss']
})
export class PaperArchiveFormComponent implements OnInit {
  @Input() archive!: PaperArchive;
  @Input() fromStation!: Station;
  @ViewChild('imageUploader') imageUploader!: ImageUploaderComponent;

  public onClose: Subject<any> = new Subject();
  form!: FormGroup;
  submitted = false;
  error: string = '';

  station!: Station | undefined;
  definition: PaperArchiveDefinition | undefined;

  constructor(private dialogRef: BsModalRef) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      belongs_to:       new FormControl('', Validators.required),
      form_datetime:    new FormControl('', Validators.required),
      classified_into:  new FormControl('', Validators.required),
      image:            new FormControl(null)
    });

    if(this.fromStation) {
      this.station = this.fromStation;
      this.f['belongs_to'].setValue(this.fromStation.station_id);
    }
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

  onDefinitionSelect(data: PaperArchiveDefinition) {
    this.definition = data;
    this.form.controls['classified_into'].setValue(data.form_id);
  }

  resetDefinition() {
    this.definition = undefined;
    this.form.controls['classified_into'].reset();
  }

  onImage(data: any) {
    console.log(data);
  }

  public onSubmit(e: Event): void {
    console.log(this.form.value);
    this.error = '';
    this.submitted = true;
    console.log(this.form.invalid);

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
