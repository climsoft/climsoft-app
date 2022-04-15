import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { QualifierComponent } from './pages/qualifier/qualifier.component';
import { QualifiersComponent } from './pages/qualifiers/qualifiers.component';
import { FormDirtyGuard } from './../auth/guards/form-dirty.guard';

const routes: Routes = [
  {
    path: '',
    component: QualifiersComponent,
    data: {
      title: 'Qualifiers'
    }
  },
  {
    path: ':id',
    component: QualifierComponent,
    data: {
      title: 'Qualidier'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QualifierRoutingModule {}
