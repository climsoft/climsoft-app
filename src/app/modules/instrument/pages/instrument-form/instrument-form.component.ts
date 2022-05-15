import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Observable, of, timer, map } from 'rxjs';
import { filter, switchMap, tap, catchError, delay, debounceTime, take } from 'rxjs/operators';

import { StationService } from './../../../station/services/station.service';
import { InstrumentService } from './../../services/instrument.service';
import { IDeactivateComponent } from '@data/interface/deactivate-component';
import { Station } from '@data/interface/station';
import { ImageUploaderComponent } from '@shared/component/image-uploader/image-uploader.component';

const numberRegex = /^-?(0|[1-9]\d*)?$/;

@Component({
  selector: 'app-instrument-form',
  templateUrl: './instrument-form.component.html',
  styleUrls: ['./instrument-form.component.scss']
})
export class InstrumentFormComponent implements OnInit, IDeactivateComponent {
  @ViewChild('imageUploader') imageUploader!: ImageUploaderComponent;
  form: FormGroup = new FormGroup({
    instrument_id: new FormControl('', Validators.required, [this.instrumentValidator()]),
    instrument_name: new FormControl('', Validators.required),
    serial_number: new FormControl('', Validators.required),
    abbreviation: new FormControl(''),
    model: new FormControl(''),
    manufacturer: new FormControl(''),
    instrument_uncertainty: new FormControl(null),
    installation_datetime: new FormControl(''),
    deinstallation_datetime: new FormControl(''),
    height: new FormControl(''),
    instrument_picture: new FormControl(null),
    installed_at: new FormControl(null, Validators.required)
  });
  error = '';
  instValidated = false;

  station: Station | undefined;

  // form: FormGroup = new FormGroup({
  //   instrument_name: new FormControl('', Validators.required),
  //   serial_number: new FormControl('', Validators.required),
  //   abbreviation: new FormControl('', Validators.required),
  //   model: new FormControl('', Validators.required),
  //   manufacturer: new FormControl('', Validators.required),
  //   instrument_uncertainty: new FormControl(0, Validators.required),
  //   installation_datetime: new FormControl('', Validators.required),
  //   deinstallation_datetime: new FormControl('', Validators.required),
  //   height: new FormControl('', Validators.required),
  //   instrument_picture: new FormControl('', Validators.required),
  //   installed_at: new FormControl('', Validators.required)
  // });

  submitted = false;
  loading: boolean = false;

  id: any;
  isUpdate = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private instService: InstrumentService,
    private stationService: StationService
  ) {}

  public canExit(): boolean {
    console.log(this.form.dirty);
    const question = 'You have unsaved changes. Are you sure you want to leave the page?';
    return this.form.dirty ? window.confirm(question) : true;
  }

  ngOnInit(): void {
    this.route.params
        .pipe(
          tap(p => {
            this.loading = p['id'];
          }),
          filter(p => p['id']),
          switchMap(p => {
            this.id = p['id'];
            this.isUpdate = true;
            this.form.removeControl('instrument_id');
            return this.instService.getInstrument(p['id']);
          })
        )
        .pipe(
          filter(res => res.result && res.result.length)
        ).subscribe(res => {
          console.log(res);
          this.form.patchValue(res.result[0]);
          this.loading = false;
          this.loadStation(res.result[0].installed_at);
        });
  }

  get f() {
    return this.form.controls;
  }

  onStationSelect(data: Station) {
    this.station = data;
    this.form.controls['installed_at'].setValue(data.station_id);
  }

  resetStation() {
    this.station = undefined;
    this.form.controls['installed_at'].reset();
  }

  onInstallDateChange(data: Date) {
    this.form.controls['installation_datetime'].setValue(data);
  }

  onDeinstallDateChange(data: Date) {
    this.form.controls['deinstallation_datetime'].setValue(data);
  }

  onSubmit(e: Event) {
    this.submitted = true;
    console.log(this.form.value);
    if(this.form.invalid) {
      return;
    }

    this.isUpdate ? this.update() : this.addNew();
  }

  onReset() {}

  onCancel() {
    this.router.navigateByUrl('/instruments');
  }

  private addNew() {
    this.imageUploader.upload().pipe(
      catchError((err) => {
        this.error = 'Image upload failed';
        throw new Error(err.nessage);
      }),
      filter((body: any) => body.result && body.result.length),
      tap((res: any) => {
        this.f['instrument_picture'].setValue(res.result[0].filepath);
      }),
      switchMap((data) => this.instService.addInstrument(this.form.value))
    ).subscribe((res: any) => {
      this.form.markAsPristine();
      this.router.navigateByUrl('/instruments');
    });
  }

  private update() {
    const updatePayload = { ...this.form.value };
    if(updatePayload.deinstallation_datetime === '') {
      updatePayload.deinstallation_datetime = null;
    }
    this.instService.updateInstrument(this.id, updatePayload).subscribe((res) => {
      of(true).pipe(delay(300)).subscribe(() => {
        this.form.markAsPristine();
        this.router.navigateByUrl('/instruments');
      });
    });
  }

  private loadStation(id: number) {
    this.stationService.getStation(id).subscribe((res) => {
      this.station = res.result[0];
    });
  }

  instrumentValidator(): AsyncValidatorFn {
    let ctrlVal = '';
    return (control: AbstractControl): Observable<any> => {
      return control.valueChanges.pipe(
        debounceTime(500),
        filter(value => value.trim().length > 0),
        take(1),
        tap((val) => {
          ctrlVal = val;
          this.instValidated = false;
        }),
        switchMap((val) => this.instService.search(val))
      ).pipe(
        map((res: any) => {
          this.instValidated = true;
          if(res.result.length > 1) {
            const exists = res.result.filter((ins: any) => ins.id === ctrlVal).length > 0;
            return exists ? { instrumentExists: true } : null;
          }
          return res.result.length === 1 ? { instrumentExists: true } : null
        }),
        catchError((error => of(null)))
      )
    }
  }
}
