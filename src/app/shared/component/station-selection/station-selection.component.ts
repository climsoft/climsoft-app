import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable, Observer, debounceTime, tap, switchMap, map, noop, of, catchError } from 'rxjs';

import { Station } from 'src/app/data/interface/station';
import { StationService } from './../../../modules/station/services/station.service';

@Component({
  selector: 'app-station-selection',
  templateUrl: './station-selection.component.html',
  styleUrls: ['./station-selection.component.scss']
})
export class StationSelectionComponent implements OnInit {
  @Input() placeholder = 'Station';
  @Output() onSelection = new EventEmitter<any>();

  asyncSelected!: string;
  typeaheadLoading: boolean = false;
  typeaheadNoResults: boolean = false;
  stations$!: Observable<any[]>;

  loading = false;
  search: string = '';
  errorMessage = '';

  selected!: Station;

  constructor(private stationService: StationService) { }

  ngOnInit(): void {
    this.stations$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search);
    }).pipe(
      debounceTime(400),
      tap(() => {
        this.errorMessage = '';
        this.loading = true;
      }),
      switchMap((query: string) => {
        if(query) {
          return this.stationService.searchStation(query).pipe(
            tap(() => { this.loading = false; }),
            map((data: any) => data.result || []),
            tap(() => noop, err => {
              this.loading = false;
              this.errorMessage = err && err.message || `station search failed`
            }),
            catchError(err => {
              this.errorMessage = 'station search failed';
              return of(err);
            })
          );
        }
        return of([]);
      })
    );
  }

  changeTypeaheadLoading(e: boolean): void {
    this.typeaheadLoading = e;
  }

  // Selected value event
  onSelect(e: TypeaheadMatch): void {
    this.selected = e.item;
    this.onSelection.emit(e.item);
  }
}
