import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { InstrumentService } from './../../../modules/instrument/services/instrument.service';
import { Observable, Observer, debounceTime, tap, switchMap, map, noop, of } from 'rxjs';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Instrument } from 'src/app/data/interface/instrument';

@Component({
  selector: 'app-instrument-selection',
  templateUrl: './instrument-selection.component.html',
  styleUrls: ['./instrument-selection.component.scss']
})
export class InstrumentSelectionComponent implements OnInit {
  @Output() onSelection = new EventEmitter<any>();

  asyncSelected!: string;
  typeaheadLoading: boolean = false;
  typeaheadNoResults: boolean = false;
  elements$!: Observable<any[]>;

  loading = false;
  search: string = '';
  errorMessage = '';

  selected!: Instrument;

  constructor(private instService: InstrumentService) { }

  ngOnInit(): void {
    this.elements$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search);
    }).pipe(
      debounceTime(400),
      tap(() => { this.loading = true; }),
      switchMap((query: string) => {
        console.log(query);
        if(query) {
          return this.instService.search(query).pipe(
            tap(() => { this.loading = false; }),
            map((data: any) => data.result || []),
            tap(() => noop, err => {
              this.errorMessage = err && err.message || `search failed`
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
