import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Observable, Observer, noop, of,  } from 'rxjs';
import { catchError, debounceTime, map, tap, switchMap } from 'rxjs/operators'

import { TimeZone } from './../../../data/interface/timezone';

import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { LookupService } from './../../services/lookup.service';

@Component({
  selector: 'app-timzone-selection',
  templateUrl: './timzone-selection.component.html',
  styleUrls: ['./timzone-selection.component.scss']
})
export class TimzoneSelectionComponent implements OnInit {
  @Input() placeholder = 'TimeZone';
  @Output() onSelection = new EventEmitter<any>();

  asyncSelected!: string;
  typeaheadLoading: boolean = false;
  typeaheadNoResults: boolean = false;
  zones$!: Observable<TimeZone[]>;

  loading = false;
  search: string = '';
  errorMessage = '';

  selected!: TimeZone;

  constructor(private lookup: LookupService) { }

  ngOnInit(): void {
    this.zones$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search);
    }).pipe(
      debounceTime(400),
      tap(() => {
        this.errorMessage = '';
        this.loading = true;
      }),
      switchMap((query: string) => {
        console.log(query);
        if(query) {
          return this.lookup.searchTimezones(query).pipe(
            tap((data) => {
              this.loading = false;
            }),
            map((data: any) => data || []),
            tap(() => noop, err => {
              console.log(err);
              this.loading = false;
              this.errorMessage = err && err.message || `timezone search failed`
            }),
            catchError(err => {
              this.errorMessage = 'timezone search failed';
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
