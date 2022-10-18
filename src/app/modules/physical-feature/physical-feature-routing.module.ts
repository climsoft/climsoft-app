import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { PhysicalFeaturesComponent } from './pages/physical-features/physical-features.component';

const routes: Routes = [
  {
    path: '',
    component: PhysicalFeaturesComponent,
    data: {
      title: 'Physical Features'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PhysicalFeaturesRoutingModule { }
