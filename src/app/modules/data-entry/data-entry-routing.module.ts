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

const routes: Routes = [
  {
    path: '',
    component: DataEntryBaseComponent,
    children: [
      {
        path: 'hourly',
        component: FormHourlyComponent,
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
        data: {
          title: 'Monthly Data'
        }
      },
      {
        path: 'hourly-wind',
        component: FormHourlyWindComponent,
        data: {
          title: 'Hourly Wind Data'
        }
      },
      {
        path: 'daily',
        component: FormDaily2Component,
        data: {
          title: 'Daily Data for Whole Month'
        }
      },
      {
        path: 'synoptic',
        component: FormSynoptic2CaribbeanComponent,
        data: {
          title: 'Caribbean Synoptic Data'
        }
      },
      {
        path: 'agro',
        component: FormAgro1Component,
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
