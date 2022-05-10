import { filter } from 'rxjs/operators';
import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-month-form-group',
  templateUrl: './month-form-group.component.html',
  styleUrls: ['./month-form-group.component.scss']
})
export class MonthFormGroupComponent implements OnInit {
  @Input() modified: boolean = false;
  @Input() group: FormGroup = new FormGroup({
    month:    new FormControl(''),
    value:  new FormControl(null, Validators.required),
    flag:   new FormControl(null),
    priod:  new FormControl(''),
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
