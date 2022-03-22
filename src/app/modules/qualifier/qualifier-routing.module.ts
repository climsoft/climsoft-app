import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { QualifierComponent } from './pages/qualifier/qualifier.component';
import { QualifierFormComponent } from './pages/qualifier-form/qualifier-form.component';
import { QualifiersComponent } from './pages/qualifiers/qualifiers.component';
import { FormDirtyGuard } from './../auth/guards/form-dirty.guard';

const routes: Routes = [
  {
    path: '',
    component: QualifiersComponent,
    data: {
      title: 'Stations'
    }
  },
  {
    path: 'new',
    component: QualifierFormComponent,
    canDeactivate: [FormDirtyGuard],
    data: {
      title: 'New Station',
      update: false
    }
  },
  {
    path: ':id/update',
    component: QualifierFormComponent,
    data: {
      title: 'Update Station',
      update: true
    }
  },
  {
    path: ':id',
    component: QualifierComponent,
    data: {
      title: 'Station'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualifierRoutingModule {}
