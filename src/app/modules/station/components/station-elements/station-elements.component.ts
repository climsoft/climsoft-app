import { Observable, of } from 'rxjs';
import { Component, Input, OnInit, AfterViewInit, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';

import { StationElement, StationElementsResponse } from './../../../../data/interface/station';
import { WiIconsService } from 'src/app/shared/services/wi-icons.service';

@Component({
  selector: 'app-station-elements',
  templateUrl: './station-elements.component.html',
  styleUrls: ['./station-elements.component.scss']
})
export class StationElementsComponent implements OnInit, OnChanges {
  @Input() source: Observable<StationElementsResponse> = of({ elements: [], page: 1, pages: 1, limit: 25 });
  elements!: StationElement[];

  @Output() onSelect = new EventEmitter<StationElement>();

  constructor(private wiIcons: WiIconsService) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.source.subscribe(data => {
      console.log(data);
      this.elements = data.elements;
    });
  }

  getIcon(abbr: string): string {
    return this.wiIcons.getIcon(abbr);
  }

  selectEl(el: StationElement) {
    this.onSelect.emit({ ...el });
  }
}
