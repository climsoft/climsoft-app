import { Component, OnInit } from '@angular/core';

import { FlagsConfig } from '@data/enum/flag';

@Component({
  selector: 'app-flag-legend',
  templateUrl: './flag-legend.component.html',
  styleUrls: ['./flag-legend.component.scss']
})
export class FlagLegendComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    console.log(FlagsConfig);

  }

  get flags(): any {
    return Object.keys(FlagsConfig)
                 .filter(k => k !== 'N')
                 .map((k) => {
                   return { key: k, value: FlagsConfig[k].label, class: FlagsConfig[k].class };
                 });
  }
}
