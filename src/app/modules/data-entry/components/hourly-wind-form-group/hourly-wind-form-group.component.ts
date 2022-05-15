import { Component, Input, OnInit, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { filter } from 'rxjs';

@Component({
  selector: 'app-hourly-wind-form-group',
  templateUrl: './hourly-wind-form-group.component.html',
  styleUrls: ['./hourly-wind-form-group.component.scss']
})
export class HourlyWindFormGroupComponent implements OnInit {
  @Input() modified: boolean = false;
  @Input() group: FormGroup = new FormGroup({
    hour: new FormControl(1),
    ddff: new FormControl(null, Validators.required),
    dd:   new FormControl(null, Validators.required),
    ff:   new FormControl(null, Validators.required),
    flag: new FormControl(null)
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

  get fg() {
    return this.group.controls;
  }

  hourVal(n: number): string {
    if(!n) {
      return '00';
    }
    if(n && n < 10) {
      return `0${n}`;
    }
    return `${n}`;
  }

  selectFlag(c: string) {
    this.group.controls['flag'].setValue(c);
  }
}
