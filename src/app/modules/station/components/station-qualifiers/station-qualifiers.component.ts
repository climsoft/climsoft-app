import { Qualifier } from './../../../../data/interface/qualifier';
import { StationQualifierResponse } from './../../../../data/interface/station';
import { Observable, of } from 'rxjs';
import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-station-qualifiers',
  templateUrl: './station-qualifiers.component.html',
  styleUrls: ['./station-qualifiers.component.scss']
})
export class StationQualifiersComponent implements OnInit, OnChanges {
  @Input() source: Observable<StationQualifierResponse> = of({ qualifiers: [], page: 1, pages: 1, limit: 25 });
  qualifiers!: Qualifier[];

  @Output() onSelect = new EventEmitter<Qualifier>();

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.source.subscribe(data => {
      console.log(data);
      this.qualifiers = data.qualifiers;
    })
  }

  selectQualifier(q: Qualifier) {
    this.onSelect.emit({ ...q });
  }
}
