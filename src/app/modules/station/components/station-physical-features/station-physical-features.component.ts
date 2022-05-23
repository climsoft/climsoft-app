import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, of } from 'rxjs';

import { PhysicalFeature, PhysicalFeatureState } from '@data/interface/physical-features';

@Component({
  selector: 'app-station-physical-features',
  templateUrl: './station-physical-features.component.html',
  styleUrls: ['./station-physical-features.component.scss']
})
export class StationPhysicalFeaturesComponent implements OnInit {
  @Input() source: Observable<PhysicalFeatureState> = of({ features: [], page: 1, pages: 1, limit: 25 });
  @Output() onSelect = new EventEmitter<PhysicalFeature>();

  items!: PhysicalFeature[] | any[];

  constructor() { }

  ngOnInit(): void {
    this.source.subscribe(data => {
      console.log(data);
      this.items = data.features;
    })
  }

  viewFeature(h: PhysicalFeature) {
    this.onSelect.emit(h);
  }
}
