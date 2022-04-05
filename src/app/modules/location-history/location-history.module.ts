import { SharedModule } from 'src/app/shared/shared.module';
import { LocationHistoryRoutingModule } from './location-history-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationHistoriesComponent } from './pages/location-histories/location-histories.component';
import { LocationHistoryComponent } from './pages/location-history/location-history.component';
import { LocationHistoryFormComponent } from './pages/location-history-form/location-history-form.component';



@NgModule({
  declarations: [
    LocationHistoriesComponent,
    LocationHistoryComponent,
    LocationHistoryFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

    LocationHistoryRoutingModule
  ]
})
export class LocationHistoryModule { }
