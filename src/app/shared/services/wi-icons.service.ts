import { Injectable } from '@angular/core';
import { WeatherIconSymbols } from 'src/app/data/maps/elements';

@Injectable({
  providedIn: 'root'
})
export class WiIconsService {
  wicons: any = {};

  constructor() {}

  init() {
    this.wicons = {};
    WeatherIconSymbols
        .filter(item => (item && item.abbr))
        .forEach((item) => {
          const key = `${item.abbr}`;
          this.wicons[key] = item.code;
        });
  }

  getIcon(abbr: string): string {
    let icon = this.wicons[abbr];
    if(icon) {

      if(icon.includes('wi-from') || icon.includes('wi-towards'))
        icon = `wi-wind ${icon}`;

      return icon;
    } else {
      return 'wi-na';
    }
  }
}
