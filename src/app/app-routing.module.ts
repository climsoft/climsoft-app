import { AuthChildrenGuard } from './modules/auth/guards/auth.child.guard';
import { PaperArchiveDefinitionModule } from './modules/paper-archive-definition/paper-archive-definition.module';
import { ForgotPasswordComponent } from './modules/auth/components/forgot-password/forgot-password.component';
import { AuthGuard } from './modules/auth/guards/auth.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { LoginComponent } from './modules/auth/components/login/login.component';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    children: [
      {
        path: 'profile',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./modules/user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./modules/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'stations',
        canActivateChild: [AuthChildrenGuard],
        loadChildren: () =>
          import('./modules/station/station.module').then((m) => m.StationModule)
      },
      {
        path: 'elements',
        canActivateChild: [AuthChildrenGuard],
        loadChildren: () =>
          import('./modules/element/element.module').then((m) => m.ElementModule)
      },
      {
        path: 'station-elements',
        canActivateChild: [AuthChildrenGuard],
        loadChildren: () =>
          import('./modules/station-element/station-element.module').then((m) => m.StationElementModule)
      },
      {
        path: 'instruments',
        canActivateChild: [AuthChildrenGuard],
        loadChildren: () =>
          import('./modules/instrument/instrument.module').then((m) => m.InstrumentModule)
      },
      {
        path: 'location-histories',
        canActivateChild: [AuthChildrenGuard],
        loadChildren: () =>
          import('./modules/location-history/location-history.module').then((m) => m.LocationHistoryModule)
      },
      {
        path: 'qualifiers',
        canActivateChild: [AuthChildrenGuard],
        loadChildren: () =>
          import('./modules/qualifier/qualifier.module').then((m) => m.QualifierModule)
      },
      {
        path: 'schedule-classes',
        canActivateChild: [AuthChildrenGuard],
        loadChildren: () =>
          import('./modules/schedule-class/schedule-class.module').then((m) => m.ScheduleClassModule)
      },
      {
        path: 'physical-features',
        canActivateChild: [AuthChildrenGuard],
        loadChildren: () =>
          import('./modules/physical-feature/physical-feature.module').then((m) => m.PhysicalFeatureModule)
      },
      {
        path: 'paper-archives',
        canActivateChild: [AuthChildrenGuard],
        loadChildren: () =>
          import('./modules/paper-archive/paper-archive.module').then((m) => m.PaperArchiveModule)
      },
      {
        path: 'paper-archive-definitions',
        canActivateChild: [AuthChildrenGuard],
        loadChildren: () =>
          import('./modules/paper-archive-definition/paper-archive-definition.module').then((m) => m.PaperArchiveDefinitionModule)
      },
      {
        path: 'data-entry',
        canActivateChild: [AuthChildrenGuard],
        loadChildren: () =>
          import('./modules/data-entry/data-entry.module').then((m) => m.DataEntryModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      }
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    data: {
      title: 'Forgot Password'
    }
  },
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
