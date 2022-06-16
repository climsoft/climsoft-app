import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { of, Observable } from 'rxjs';

import { StationLocationHistory, StationLocationHistoryResponse } from './../../../../data/interface/station';

@Component({
  selector: 'app-location-history',
  templateUrl: './location-history.component.html',
  styleUrls: ['./location-history.component.scss']
})
export class LocationHistoryComponent implements OnInit, OnChanges {
  @Input() source: Observable<StationLocationHistoryResponse> = of({ history: [], page: 1, pages: 1, limit: 25 });
  @Output() onSelect = new EventEmitter<StationLocationHistory>();

  items!: StationLocationHistory[] | any[];

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.source.subscribe(data => {
      console.log(data);
      this.items = data.history;
    });
  }

  selectHist(h: any) {
    this.onSelect.emit(h);
  }
}
