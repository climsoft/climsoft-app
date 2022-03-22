import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs/operators';

import { IDeactivateComponent } from '../../../../data/interface/deactivate-component';
import { StationService } from '../../services/station.service';

declare var window: any;

const numberRegex = /^-?(0|[1-9]\d*)?$/;

@Component({
  selector: 'app-station-form',
  templateUrl: './station-form.component.html',
  styleUrls: ['./station-form.component.scss']
})
export class StationFormComponent implements OnInit, IDeactivateComponent {

  form: FormGroup = new FormGroup({
    station_name:      new FormControl('', Validators.required),
    longitude:        new FormControl(''),
    latitude:         new FormControl(''),
    elevation:        new FormControl(''),
    wmoid:            new FormControl(''),
    icaoid:           new FormControl(''),
    country:          new FormControl(''),
    authority:        new FormControl(''),
    admin_region:      new FormControl(''),
    drainage_basin:    new FormControl(''),
    qualifier:        new FormControl(''),
    opening_datetime:      new FormControl(''),
    closing_datetime:      new FormControl(''),
    geolocation_method:    new FormControl(''),
    geolocation_accuracy:  new FormControl(''),
    station_operational:   new FormControl(false),
    waca_selection:        new FormControl(false),
    cpt_selection:         new FormControl(false)
  });
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
          this.form.patchValue(res.result[0]);
          this.loading = false;
        });
  }

  get f() {
    return this.form.controls;
  }

  onSubmit(e: Event) {
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

  onReset() {}

  onCancel() {
    this.router.navigateByUrl('/stations');
  }
}
