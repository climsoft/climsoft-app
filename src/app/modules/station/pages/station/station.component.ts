import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import {  filter, map, switchMap, take, tap } from 'rxjs/operators';

import { StationService } from './../../services/station.service';

@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent implements OnInit {
  station: any;
  stationName: string | undefined;
  id: any;

  constructor(private route: ActivatedRoute, private stationService: StationService) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(p => {
        this.id = p['id'];
        return this.stationService.getStation(p['id'])
      })
    ).pipe(
      filter(res => res.result && res.result[0]),
      tap(res => { this.stationName = res.result[0].station_name }),
      map(res => this.stationService.adapt(res.result[0])),
      take(1)
    ).subscribe(st =>{
      this.station = st;
      this.stationService.getStationElements(this.id).subscribe();
    });
  }

}
