import { FormDirtyGuard } from './../auth/guards/form-dirty.guard';
import { StationFormComponent } from './pages/station-form/station-form.component';
import { StationsComponent } from './pages/stations/stations.component';
import { StationComponent } from './pages/station/station.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: StationsComponent,
    data: {
      title: 'Stations'
    }
  },
  {
    path: 'new',
    component: StationFormComponent,
    canDeactivate: [FormDirtyGuard],
    data: {
      title: 'New Station',
      update: false
    }
  },
  {
    path: ':id/update',
    component: StationFormComponent,
    data: {
      title: 'Update Station',
      update: true
    }
  },
  {
    path: ':id',
    component: StationComponent,
    data: {
      title: 'Station'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StationRoutingModule {
}
