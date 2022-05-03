import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@shared/shared.module';
import { ScheduleClassRoutingModule } from './schedule-class-routing.module';
import { ScheduleClassesComponent } from './pages/schedule-classes/schedule-classes.component';
import { ScheduleClassFormComponent } from './components/schedule-class-form/schedule-class-form.component';

@NgModule({
  declarations: [
    ScheduleClassesComponent,
    ScheduleClassFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

    ScheduleClassRoutingModule
  ]
})
export class ScheduleClassModule { }
