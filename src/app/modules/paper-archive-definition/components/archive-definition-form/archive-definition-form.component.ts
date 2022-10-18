import { BsModalRef } from 'ngx-bootstrap/modal';
import { PaperArchiveDefinition } from './../../../../data/interface/paper-archive';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-archive-definition-form',
  templateUrl: './archive-definition-form.component.html',
  styleUrls: ['./archive-definition-form.component.scss']
})
export class ArchiveDefinitionFormComponent implements OnInit {
  @Input() definition: PaperArchiveDefinition | undefined;
  public onClose: Subject<any> = new Subject();
  form!: FormGroup;
  submitted = false;

  definitions!: PaperArchiveDefinition | undefined;

  constructor(private dialogRef: BsModalRef) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      form_id:     new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });

    if(this.definition) {
      this.form.patchValue(this.definition);
      this.f['form_id'].disable();
    }
  }

  get update(): boolean {
    return !!this.definition;
  }

  get f() {
    return this.form.controls;
  }

  public onSubmit(e: Event): void {
    this.submitted = true;
    if(this.form.invalid) {
      return;
    }
    this.onClose.next(this.update? this.f['description'].value : this.form.value);
    this.dialogRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.dialogRef.hide();
  }
}
