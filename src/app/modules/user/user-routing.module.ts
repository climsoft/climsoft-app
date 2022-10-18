import { PreferencesComponent } from './pages/preferences/preferences.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FormDirtyGuard } from './../auth/guards/form-dirty.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { UpdatePasswordComponent } from './pages/update-password/update-password.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    data: {
      title: 'Profile'
    },
    children: [
      {
        path: 'update',
        component: UpdateProfileComponent,
        canDeactivate: [FormDirtyGuard]
      },
      {
        path: 'password',
        component: UpdatePasswordComponent,
        canDeactivate: [FormDirtyGuard]
      },
      {
        path: 'preferences',
        component: PreferencesComponent,
        canDeactivate: [FormDirtyGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
