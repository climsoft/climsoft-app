import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormDirtyGuard } from '../auth/guards/form-dirty.guard';
import { InstrumentComponent } from './pages/instrument/instrument.component';
import { InstrumentFormComponent } from './pages/instrument-form/instrument-form.component';
import { InstrumentsComponent } from './pages/instruments/instruments.component';


const routes: Routes = [
  {
    path: '',
    component: InstrumentsComponent,
    data: {
      title: 'Instruments'
    }
  },
  {
    path: 'new',
    component: InstrumentFormComponent,
    canDeactivate: [FormDirtyGuard],
    data: {
      title: 'New Instrument',
      update: false
    }
  },
  {
    path: ':id/update',
    component: InstrumentFormComponent,
    data: {
      title: 'Update Instrument',
      update: true
    }
  },
  {
    path: ':id',
    component: InstrumentComponent,
    data: {
      title: 'Instrument'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstrumentRoutingModule {
}
