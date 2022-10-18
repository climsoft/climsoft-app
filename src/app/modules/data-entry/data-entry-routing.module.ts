import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DataEntryBaseComponent } from './pages/data-entry-base/data-entry-base.component';
import { FormAgro1Component } from './pages/form-agro1/form-agro1.component';
import { FormSynoptic2CaribbeanComponent } from './pages/form-synoptic2-caribbean/form-synoptic2-caribbean.component';
import { FormMonthlyComponent } from './pages/form-monthly/form-monthly.component';
import { FormHourlyWindComponent } from './pages/form-hourly-wind/form-hourly-wind.component';
import { FormHourlyComponent } from './pages/form-hourly/form-hourly.component';
import { FormDaily2Component } from './pages/form-daily2/form-daily2.component';

import { FormDirtyGuard } from '../auth/guards/form-dirty.guard';
import { FormSynopticRaComponent } from './pages/form-synoptic-ra/form-synoptic-ra.component';

const routes: Routes = [
  {
    path: '',
    component: DataEntryBaseComponent,
    children: [
      {
        path: 'hourly',
        component: FormHourlyComponent,
        canDeactivate: [FormDirtyGuard],
        data: {
          title: 'Hourly Data'
        }
      },
      {
        path: '',
        redirectTo: 'daily',
        data: {
          title: 'Data Entry'
        }
      },
      {
        path: 'monthly',
        component: FormMonthlyComponent,
        canDeactivate: [FormDirtyGuard],
        data: {
          title: 'Monthly Data'
        }
      },
      {
        path: 'hourly-wind',
        component: FormHourlyWindComponent,
        canDeactivate: [FormDirtyGuard],
        data: {
          title: 'Hourly Wind Data'
        }
      },
      {
        path: 'daily',
        component: FormDaily2Component,
        canDeactivate: [FormDirtyGuard],
        data: {
          title: 'Daily Data for Whole Month'
        }
      },
      {
        path: 'synoptic-carribiean',
        component: FormSynoptic2CaribbeanComponent,
        canDeactivate: [FormDirtyGuard],
        data: {
          title: 'Caribbean Synoptic Data'
        }
      },
      {
        path: 'synoptic-2ra1',
        component: FormSynopticRaComponent,
        canDeactivate: [FormDirtyGuard],
        data: {
          title: 'Caribbean 2RA1'
        }
      },
      {
        path: 'agro',
        component: FormAgro1Component,
        canDeactivate: [FormDirtyGuard],
        data: {
          title: 'Kenya Agromet Data'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DataEntryRoutingModule {}
