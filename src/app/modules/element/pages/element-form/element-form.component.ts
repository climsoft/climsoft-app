import { filter, switchMap } from 'rxjs/operators';
import { tap } from 'rxjs';
import { ElementService } from './../../services/element.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

const numberRegex = /^-?(0|[1-9]\d*)?$/;

@Component({
  selector: 'app-element-form',
  templateUrl: './element-form.component.html',
  styleUrls: ['./element-form.component.scss']
})
export class ElementFormComponent implements OnInit {

  form: FormGroup = new FormGroup({
    element_name:       new FormControl('', Validators.required),
    abbreviation:       new FormControl(''),
    element_type:       new FormControl(''),
    description:        new FormControl(''),
    lower_limit:        new FormControl(''),
    upper_limit:        new FormControl(''),
    units:              new FormControl(''),
    element_scale:      new FormControl(''),
    qc_total_required:  new FormControl(false),
    selected:           new FormControl(false)
  });

  // form: FormGroup = new FormGroup({
  //   element_name:       new FormControl('', Validators.required),
  //   abbreviation:       new FormControl(''),
  //   element_type:       new FormControl('', Validators.required),
  //   description:        new FormControl(''),
  //   lower_limit:        new FormControl('', [Validators.required, Validators.pattern(numberRegex)]),
  //   upper_limit:        new FormControl('', [Validators.required, Validators.pattern(numberRegex)]),
  //   units:              new FormControl('', Validators.required),
  //   element_scale:      new FormControl(''),
  //   qc_total_required:  new FormControl(false),
  //   selected:           new FormControl(false)
  // });

  submitted = false;
  loading: boolean = false;
  error = false;

  id: any;
  isUpdate = false;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private elementService: ElementService
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
            return this.elementService.getElement(p['id']);
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
        this.elementService.updateElement(this.id, this.form.value) :
          this.elementService.addElement(this.form.value)
    ).subscribe(res => {
        this.form.reset();
        this.router.navigateByUrl('/elements');
      });
  }

  onReset() {}

  onCancel() {
    this.router.navigateByUrl('/stations');
  }
}
