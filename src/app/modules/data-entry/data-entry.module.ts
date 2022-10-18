import { FormAgro1Component } from './pages/form-agro1/form-agro1.component';
import { FormSynoptic2CaribbeanComponent } from './pages/form-synoptic2-caribbean/form-synoptic2-caribbean.component';
import { FormMonthlyComponent } from './pages/form-monthly/form-monthly.component';
import { FormHourlyWindComponent } from './pages/form-hourly-wind/form-hourly-wind.component';
import { FormHourlyComponent } from './pages/form-hourly/form-hourly.component';
import { FormDaily2Component } from './pages/form-daily2/form-daily2.component';
import { DataEntryBaseComponent } from './pages/data-entry-base/data-entry-base.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { DataEntryRoutingModule } from './data-entry-routing.module';
import { DailyDayFormGroupComponent } from './components/daily-day-form-group/daily-day-form-group.component';
import { HourlyFormGroupComponent } from './components/hourly-form-group/hourly-form-group.component';
import { SynopticFormGroupComponent } from './components/synoptic-form-group/synoptic-form-group.component';
import { MonthFormGroupComponent } from './components/month-form-group/month-form-group.component';
import { HourlyWindFormGroupComponent } from './components/hourly-wind-form-group/hourly-wind-form-group.component';
import { AgroFormGroupComponent } from './components/agro-form-group/agro-form-group.component';
import { FormSynopticRaComponent } from './pages/form-synoptic-ra/form-synoptic-ra.component';

@NgModule({
  declarations: [
    DataEntryBaseComponent,
    FormAgro1Component,
    FormDaily2Component,
    FormHourlyComponent,
    FormHourlyWindComponent,
    FormMonthlyComponent,
    FormSynoptic2CaribbeanComponent,
    DailyDayFormGroupComponent,
    HourlyFormGroupComponent,
    SynopticFormGroupComponent,
    MonthFormGroupComponent,
    HourlyWindFormGroupComponent,
    AgroFormGroupComponent,
    FormSynopticRaComponent
  ],
  imports: [
    CommonModule,
    DataEntryRoutingModule,

    SharedModule
  ]
})

export class DataEntryModule { }
