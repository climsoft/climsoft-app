import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { debounceTime, tap, switchMap, map, catchError } from 'rxjs/operators';
import { PaperArchiveService } from '@paper-archive/services/paper-archive.service';
import { PaperArchiveDefinition } from './../../../data/interface/paper-archive';
import { Observable, Observer, noop, of } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-archive-definition-selection',
  templateUrl: './archive-definition-selection.component.html',
  styleUrls: ['./archive-definition-selection.component.scss']
})
export class ArchiveDefinitionSelectionComponent implements OnInit {
  @Input() placeholder = 'Classified Into';
  @Output() onSelection = new EventEmitter<any>();

  asyncSelected!: string;
  typeaheadLoading: boolean = false;
  typeaheadNoResults: boolean = false;
  definitions$!: Observable<any[]>;

  loading = false;
  search: string = '';
  errorMessage = '';

  selected!: PaperArchiveDefinition;

  constructor(private archiveService: PaperArchiveService) { }

  ngOnInit(): void {
    this.definitions$ = new Observable((observer: Observer<string>) => {
      observer.next(this.search);
    }).pipe(
      debounceTime(400),
      tap(() => {
        this.errorMessage = '';
        this.loading = true;
      }),
      switchMap((query: string) => {
        if(query) {
          return this.archiveService.searchDefinitions(query).pipe(
            tap(() => { this.loading = false; }),
            map((data: any) => data.result || []),
            tap(() => noop, err => {
              this.loading = false;
              this.errorMessage = err && err.message || `search failed`
            }),
            catchError(err => {
              this.errorMessage = 'search failed';
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
