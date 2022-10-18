import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import { map, take, delay } from 'rxjs/operators';

import { TimeZone } from 'src/app/data/interface/timezone';
import TimeZones from './../../../assets/data/time-zones.json'

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  zoneIndexes: string[] = [];
  zones$!: Observable<TimeZone[]>;

  constructor() {
    this.init();
  }

  init() {
    let zones: TimeZone[] = [];
    TimeZones.forEach((z: any) => {
      const vals: TimeZone[] = z.utc.map((u: string) => ({ key: `${z.abbr} - ${z.value}`, value: u, offset: z.offset }));
      zones = [ ...zones, ...vals ];
    });
    this.zones$ = of(zones);
    this.zoneIndexes = zones.map(z => z.value);
  }

  searchTimezones(query: string = ''): Observable<TimeZone[]> {
    if(!query) {
      return this.zones$.pipe(take(8), delay(200));
    }

    const regX =  new RegExp(`^${query.toLowerCase()}`);
    const indexes: number[] = [];
    for(const i in this.zoneIndexes) {
      if(regX.test(this.zoneIndexes[i].toLowerCase()) && indexes.length < 8) {
        indexes.push(+i);
      }
    }

    return this.zones$.pipe(
              map((list) => {
                return list.filter((item, i) => indexes.indexOf(i) > -1)
              }),
              delay(200)
            );
  }
}
