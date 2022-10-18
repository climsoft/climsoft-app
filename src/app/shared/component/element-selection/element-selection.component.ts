import { tap } from 'rxjs/operators';
import { ElementService } from './../../../modules/element/services/element.service';
import { ObsElement } from './../../../data/interface/element';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { map, noop, Observable, Observer, switchMap, of, debounceTime } from 'rxjs';

@Component({
  selector: 'app-element-selection',
  templateUrl: './element-selection.component.html',
  styleUrls: ['./element-selection.component.scss']
})
export class ElementSelectionComponent implements OnInit {
  @Output() onSelection = new EventEmitter<any>();

  asyncSelected!: string;
  typeaheadLoading: boolean = false;
  typeaheadNoResults: boolean = false;
  elements$!: Observable<any[]>;

  loading = false;
  search: string = '';
  errorMessage = '';

  selected!: ObsElement;

  constructor(private elementService: ElementService) { }

  ngOnInit(): void {
    this.elements$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search);
    }).pipe(
      debounceTime(400),
      tap(() => { this.loading = true; }),
      switchMap((query: string) => {
        console.log(query);
        if(query) {
          return this.elementService.searchElements(query).pipe(
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
