import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ScheduleClassesComponent } from './pages/schedule-classes/schedule-classes.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleClassesComponent,
    data: {
      title: 'Schedule Classes'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScheduleClassRoutingModule { }
