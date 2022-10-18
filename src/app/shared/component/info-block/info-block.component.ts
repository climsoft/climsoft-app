import { Component, OnInit, Input } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-info-block',
  templateUrl: './info-block.component.html',
  styleUrls: ['./info-block.component.scss']
})
export class InfoBlockComponent implements OnInit {
  @Input() config: any;

  constructor() { }

  ngOnInit(): void {}

  isDate(date: string | any) {
    const mdt = moment(date);
    return mdt.isValid();
  }
}
