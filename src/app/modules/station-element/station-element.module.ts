import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { StationElementRoutingModule } from './station-element-routing.module';
import { StationElementsComponent } from './pages/station-elements/station-elements.component';
import { StationElementComponent } from './pages/station-element/station-element.component';
import { StationElementFormComponent } from './components/station-element-form/station-element-form.component';

@NgModule({
  declarations: [
    StationElementsComponent,
    StationElementComponent,
    StationElementFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

    StationElementRoutingModule
  ]
})
export class StationElementModule { }
