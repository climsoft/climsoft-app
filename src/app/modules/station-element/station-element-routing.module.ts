import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormDirtyGuard } from '../auth/guards/form-dirty.guard';
import { StationElementsComponent } from './pages/station-elements/station-elements.component';
import { StationElementComponent } from './pages/station-element/station-element.component';


const routes: Routes = [
  {
    path: '',
    component: StationElementsComponent,
    data: {
      title: 'Station Elements'
    }
  },
  {
    path: ':id',
    component: StationElementComponent,
    data: {
      title: 'Station Element'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StationElementRoutingModule {
}
