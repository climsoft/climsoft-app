import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-no-value',
  templateUrl: './no-value.component.html',
  styleUrls: ['./no-value.component.scss']
})
export class NoValueComponent implements OnInit {
  @Input() message = 'No Value';

  constructor() { }

  ngOnInit(): void {}
}
