import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { filter } from 'rxjs';

interface DailyRecord {
    day:    number,
    value:  string,
    flag:   string,
    period: string
}

const patternRegex = ``;

// TODO: On FormGroup load do we have incoming record or it is blank. if record set state and keep a copy;
// TODO: If the record exists change the color ot the FormGroup to an agreed color exmaple light blue;
// TODO: If user modifies the data the color changes to light orange/beige
// TODO: If the form values have been modified then on hover over the form user can see a reset button
// TODO: When user clicks the reset button a confirmation dialog appears showing original values the form will reset to.
// TODO: If user chooses Yes in confirmation dialog, the form values get reset to original.

@Component({
  selector: 'app-daily-day-form-group',
  templateUrl: './daily-day-form-group.component.html',
  styleUrls: ['./daily-day-form-group.component.scss']
})
export class DailyDayFormGroupComponent implements OnInit, OnChanges {
  @Input() modified: boolean = false;
  @Input() group: FormGroup = new FormGroup({
    day:    new FormControl(1),
    value:  new FormControl(null, Validators.required),
    flag:   new FormControl(null, Validators.pattern(patternRegex)),
    period: new FormControl(null)
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
}
