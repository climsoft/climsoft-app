import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormDirtyGuard } from '../auth/guards/form-dirty.guard';
import { ElementComponent } from './pages/element/element.component';
import { ElementFormComponent } from './pages/element-form/element-form.component';
import { ElementsComponent } from './pages/elements/elements.component';

const routes: Routes = [
  {
    path: '',
    component: ElementsComponent,
    data: {
      title: 'Elements'
    }
  },
  {
    path: 'new',
    component: ElementFormComponent,
    canDeactivate: [FormDirtyGuard],
    data: {
      title: 'New Element',
      update: false
    }
  },
  {
    path: ':id/update',
    component: ElementFormComponent,
    data: {
      title: 'Update Station',
      update: true
    }
  },
  {
    path: ':id',
    component: ElementComponent,
    data: {
      title: 'Element'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ElementRoutingModule {
}
