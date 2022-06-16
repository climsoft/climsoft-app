import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, of, map } from 'rxjs';

import { PhysicalFeature, PhysicalFeatureState } from '@data/interface/physical-features';

@Component({
  selector: 'app-station-physical-features',
  templateUrl: './station-physical-features.component.html',
  styleUrls: ['./station-physical-features.component.scss']
})
export class StationPhysicalFeaturesComponent implements OnInit, OnChanges {
  @Input() source: Observable<PhysicalFeatureState> = of({ features: [], page: 1, pages: 1, limit: 25 });
  @Output() onSelect = new EventEmitter<PhysicalFeature>();

  items!: PhysicalFeature[] | any[];

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(changes: any): void {
    this.source.subscribe(data => {
      this.items = data.features;
    })
  }

  viewFeature(h: PhysicalFeature) {
    this.onSelect.emit(h);
  }
}
