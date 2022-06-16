import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormControl, Validators, AsyncValidatorFn, AbstractControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap, take } from 'rxjs/operators';

import { IDeactivateComponent } from '../../../../data/interface/deactivate-component';
import { StationService } from '../../services/station.service';
import * as moment from 'moment';
import { Observable, debounceTime, map, catchError, of } from 'rxjs';

declare var window: any;

const numberRegex = /^-?(0|[1-9]\d*)?$/;

@Component({
  selector: 'app-station-form',
  templateUrl: './station-form.component.html',
  styleUrls: ['./station-form.component.scss']
})
export class StationFormComponent implements OnInit, IDeactivateComponent {

  bsBegin!: Date;
  bsEnd!: Date;
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    containerClass:'theme-blue',
    dateInputFormat: 'DD/MM/YYYY HH:mm',
    withTimepicker: true,
  };
  minDate!: Date;
  stValidated = false;

  form: FormGroup = new FormGroup({
    station_id:       new FormControl(null, Validators.required, [this.stationValidator()]),
    station_name:     new FormControl('', Validators.required),
    longitude:        new FormControl(''),
    latitude:         new FormControl(''),
    elevation:        new FormControl(''),
    wmoid:            new FormControl(''),
    icaoid:           new FormControl(''),
    country:          new FormControl(''),
    authority:        new FormControl(''),
    admin_region:     new FormControl(''),
    drainage_basin:   new FormControl(''),
    qualifier:        new FormControl(''),
    opening_datetime:      new FormControl(''),
    closing_datetime:      new FormControl(''),
    geolocation_method:    new FormControl(''),
    geolocation_accuracy:  new FormControl(''),
    station_operational:   new FormControl(false),
    waca_selection:        new FormControl(false),
    cpt_selection:         new FormControl(false)
  });
  // Use a LatLng custom Validator from https://codereview.stackexchange.com/questions/230908/angular-control-for-inputting-latitude-and-longitude-with-validation
  // form: FormGroup = new FormGroup({
  //   station_name:      new FormControl('', Validators.required),
  //   longitude:        new FormControl('', [Validators.required, Validators.pattern(numberRegex)]),
  //   latitude:         new FormControl('', [Validators.required, Validators.pattern(numberRegex)]),
  //   elevation:        new FormControl('', Validators.required),
  //   wmoid:            new FormControl('', Validators.required),
  //   icaoid:           new FormControl('', Validators.required),
  //   country:          new FormControl('', Validators.required),
  //   authority:        new FormControl('', Validators.required),
  //   admin_region:      new FormControl('', Validators.required),
  //   drainage_basin:    new FormControl('', Validators.required),
  //   qualifier:        new FormControl('', Validators.required),
  //   opening_datetime:      new FormControl('', Validators.required),
  //   closing_datetime:      new FormControl('', Validators.required),
  //   geolocation_method:    new FormControl('', Validators.required),
  //   geolocation_accuracy:  new FormControl('', [Validators.required, Validators.pattern(numberRegex)]),
  //   station_operational:   new FormControl(false),
  //   waca_selection:        new FormControl(false),
  //   cpt_selection:         new FormControl(false)
  // });
  submitted = false;
  loading: boolean = false;
  error = false;

  id: any;
  isUpdate = false;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private stationService: StationService
    ) {}

  public canExit(): boolean {
    console.log(this.form.dirty);
    const question = 'You have unsaved changes. Are you sure you want to leave the page?';
    return this.form.dirty ? window.confirm(question) : true;
  };

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
            return this.stationService.getStation(p['id']);
          })
        )
        .pipe(
          filter(res => res.result && res.result.length)
        ).subscribe(res => {
          console.log(res);
          this.form.removeControl('station_id');
          this.form.patchValue(res.result[0]);
          this.loading = false;
        });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(e: Event) {
    console.log(this.form.value);
    this.submitted = true;
    if(this.form.invalid) {
      return;
    }
    (
      this.isUpdate ?
        this.stationService.updateStation(this.id, this.form.value) :
          this.stationService.addStation(this.form.value)
    ).subscribe(res => {
        this.form.reset();
        this.router.navigateByUrl('/stations');
      });
  }

  onOpeningChanged(data: Date) {
    if(data) {
      this.form.controls['opening_datetime'].setValue(data.toISOString());
      this.minDate = moment(data).startOf('day').add(1, 'day').toDate();
    }
  }

  onClosingChanged(data: Date) {
    if(data) {
      this.form.controls['closing_datetime'].setValue(data.toISOString());
    }
  }

  onReset() {}

  onCancel() {
    this.router.navigateByUrl('/stations');
  }

  stationValidator(): AsyncValidatorFn {
    let ctrlVal = '';
    return (control: AbstractControl): Observable<any> => {
      return control.valueChanges.pipe(
        debounceTime(500),
        filter(value => value.trim().length > 0),
        take(1),
        tap((val) => {
          ctrlVal = val;
          this.stValidated = false;
        }),
        switchMap((val) => this.stationService.searchStation(val))
      ).pipe(
        map((res: any) => {
          this.stValidated = true;
          if(res.result.length > 1) {
            const exists = res.result.filter((st: any) => st.station_id === ctrlVal).length > 0;
            return exists ? { stationExists: true } : null;
          }
          if(res.result.length) {
            control.markAsTouched();
          }
          return res.result.length === 1 ? { stationExists: true } : null
        }),
        catchError((error => of(null)))
      )
    }
  }
}
