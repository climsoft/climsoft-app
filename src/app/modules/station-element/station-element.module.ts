import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { StationElementRoutingModule } from './station-element-routing.module';
import { StationElementsComponent } from './pages/station-elements/station-elements.component';
import { StationElementComponent } from './pages/station-element/station-element.component';

@NgModule({
  declarations: [
    StationElementsComponent,
    StationElementComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

    StationElementRoutingModule
  ]
})
export class StationElementModule { }
