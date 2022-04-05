import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { FormDirtyGuard } from './../auth/guards/form-dirty.guard';
import { LocationHistoryComponent } from './../station/components/location-history/location-history.component';
import { LocationHistoryFormComponent } from './pages/location-history-form/location-history-form.component';
import { LocationHistoriesComponent } from './pages/location-histories/location-histories.component';

const routes: Routes = [
  {
    path: '',
    component: LocationHistoriesComponent,
    data: {
      title: 'Location History List'
    }
  },
  {
    path: 'new',
    component: LocationHistoryFormComponent,
    canDeactivate: [FormDirtyGuard],
    data: {
      title: 'New Location History',
      update: false
    }
  },
  {
    path: ':id/update',
    component: LocationHistoryFormComponent,
    data: {
      title: 'Update Location History',
      update: true
    }
  },
  {
    path: ':id',
    component: LocationHistoryComponent,
    data: {
      title: 'Location Hisotry Details'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocationHistoryRoutingModule { }
