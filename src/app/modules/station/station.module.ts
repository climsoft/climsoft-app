import { StationRoutingModule } from './station-routing.module';
import { Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationsComponent } from './pages/stations/stations.component';
import { StationComponent } from './pages/station/station.component';
import { StationFormComponent } from './pages/station-form/station-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    StationsComponent,
    StationComponent,
    StationFormComponent
  ],
  imports: [
    CommonModule,
    StationRoutingModule,
    SharedModule
  ]
})
export class StationModule { }
