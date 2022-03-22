import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { filter, switchMap, tap } from 'rxjs/operators';

import { InstrumentService } from './../../services/instrument.service';
import { IDeactivateComponent } from './../../../../data/interface/deactivate-component';

const numberRegex = /^-?(0|[1-9]\d*)?$/;

@Component({
  selector: 'app-instrument-form',
  templateUrl: './instrument-form.component.html',
  styleUrls: ['./instrument-form.component.scss']
})
export class InstrumentFormComponent implements OnInit, IDeactivateComponent {
  form: FormGroup = new FormGroup({
    instrument_name: new FormControl('', Validators.required),
    serial_number: new FormControl('', Validators.required),
    abbreviation: new FormControl(''),
    model: new FormControl(''),
    manufacturer: new FormControl(''),
    instrument_uncertainty: new FormControl(null),
    installation_datetime: new FormControl(''),
    deinstallation_datetime: new FormControl(''),
    height: new FormControl(''),
    instrument_picture: new FormControl(''),
    installed_at: new FormControl('')
  });

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
  error = false;

  id: any;
  isUpdate = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private instService: InstrumentService
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
            return this.instService.getInstrument(p['id']);
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
        this.instService.updateInstrument(this.id, this.form.value) :
          this.instService.addInstrument(this.form.value)
    ).subscribe(res => {
        this.form.reset();
        this.router.navigateByUrl('/instruments');
      });
  }

  onReset() {}

  onCancel() {
    this.router.navigateByUrl('/instruments');
  }

}
