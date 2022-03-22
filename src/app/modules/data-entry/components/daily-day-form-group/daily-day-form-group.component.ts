import { FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';

interface DailyRecord {
    day:    number,
    value:  string,
    flag:   string,
    period: string
}

@Component({
  selector: 'app-daily-day-form-group',
  templateUrl: './daily-day-form-group.component.html',
  styleUrls: ['./daily-day-form-group.component.scss']
})
export class DailyDayFormGroupComponent implements OnInit {
  @Input() group: FormGroup = new FormGroup({
    day:    new FormControl(1),
    value:  new FormControl(''),
    flag:   new FormControl(''),
    period: new FormControl('')
  });

  constructor() { }

  ngOnInit(): void {}

  get fg() {
    return this.group.controls;
  }
}
