import { FormControl } from '@angular/forms';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-data-time',
  templateUrl: './data-time.component.html',
  styleUrls: ['./data-time.component.scss']
})
export class DataTimeComponent implements OnInit {
  @Input() submitted: boolean = false;
  @Input() current!: Date;
  @Input() error!: string;
  @Input() minDate!: Date;

  @Output() onChange = new EventEmitter<any>();

  focused = false;

  bsValue!: Date;
  time!:  Date;
  invalid = false;
  bsConfig: Partial<BsDatepickerConfig> = {
    isAnimated: true,
    withTimepicker: true,
    dateInputFormat: 'DD/MM/YYYY HH:mm'
  };

  constructor() {}

  ngOnInit(): void {
    this.current = this.current? new Date(this.current) : new Date();
    this.bsValue = new Date(this.current);
    const date = moment(this.current);
    this.invalid = !this.current || !date.isValid();
  }

  onDateChanged(data: Date) {
    if(data) {
      this.bsValue.setFullYear(data.getFullYear(), data.getMonth(), data.getDate());
      this.onChange.emit(this.bsValue);
    }
  }
}
