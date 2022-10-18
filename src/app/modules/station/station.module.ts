import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { StationRoutingModule } from './station-routing.module';

import { StationsComponent } from './pages/stations/stations.component';
import { StationComponent } from './pages/station/station.component';
import { StationFormComponent } from './pages/station-form/station-form.component';
import { StationElementsComponent } from './components/station-elements/station-elements.component';
import { LocationHistoryComponent } from './components/location-history/location-history.component';
import { StationElementDialogComponent } from './components/station-element-dialog/station-element-dialog.component';
import { LocationHistoryDialogComponent } from './components/location-history-dialog/location-history-dialog.component';
import { StationPhysicalFeaturesComponent } from './components/station-physical-features/station-physical-features.component';
import { StationQualifiersComponent } from './components/station-qualifiers/station-qualifiers.component';
import { StationPaperArchiveComponent } from './components/station-paper-archive/station-paper-archive.component';



@NgModule({
  declarations: [
    StationsComponent,
    StationComponent,
    StationFormComponent,
    StationElementsComponent,
    LocationHistoryComponent,
    StationElementDialogComponent,
    LocationHistoryDialogComponent,
    StationPhysicalFeaturesComponent,
    StationQualifiersComponent,
    StationPaperArchiveComponent
  ],
  imports: [
    CommonModule,
    StationRoutingModule,
    SharedModule
  ]
})
export class StationModule { }
