import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-synoptic-form-group',
  templateUrl: './synoptic-form-group.component.html',
  styleUrls: ['./synoptic-form-group.component.scss']
})
export class SynopticFormGroupComponent implements OnInit {
  @Input() modified: boolean = false;
  @Input() group: FormGroup = new FormGroup({
    key:    new FormControl(''),
    label:  new FormControl(''),
    value:  new FormControl(null, Validators.required),
    flag:   new FormControl(null)
  });
  @Input() disabled: boolean = false;
  @Output() onDirty: EventEmitter<boolean> = new EventEmitter;

  constructor() { }

  ngOnInit(): void {
    this.group.valueChanges.pipe(
      filter((val) => !this.modified)
    ).subscribe((val) => {
      console.log(val);
      this.onDirty.emit(true);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.disabled) {
      this.group.disable();
    } else {
      this.group.enable();
    }
  }

  selectFlag(f: string) {
    this.group.controls['flag'].setValue(f);
  }

  get fg() {
    return this.group.controls;
  }

}
