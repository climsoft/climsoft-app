import { PreferencesDialogComponent } from './components/preferences-dialog/preferences-dialog.component';
import { ProfileDialogComponent } from './components/profile-dialog/profile-dialog.component';
import { PasswordDialogComponent } from './components/password-dialog/password-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { UserRoutingModule } from './user-routing.module';

import { ProfileComponent } from './pages/profile/profile.component';
import { UpdatePasswordComponent } from './pages/update-password/update-password.component';
import { PreferencesComponent } from './pages/preferences/preferences.component';
import { UpdateProfileComponent } from './pages/update-profile/update-profile.component';
import { ProfileLoadingComponent } from './components/profile-loading/profile-loading.component';


@NgModule({
  declarations: [
    ProfileComponent,
    UpdatePasswordComponent,
    PreferencesComponent,
    UpdateProfileComponent,
    PasswordDialogComponent,
    ProfileDialogComponent,
    PreferencesDialogComponent,
    ProfileLoadingComponent
  ],
  imports: [
    CommonModule,

    SharedModule,
    UserRoutingModule
  ]
})
export class UserModule { }
