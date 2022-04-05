import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { PhysicalFeaturesRoutingModule } from './physical-feature-routing.module';
import { PhysicalFeaturesComponent } from './pages/physical-features/physical-features.component';
import { PhysicalFeatureComponent } from './components/physical-feature/physical-feature.component';
import { PhysicalFeatureFormComponent } from './components/physical-feature-form/physical-feature-form.component';


@NgModule({
  declarations: [
    PhysicalFeaturesComponent,
    PhysicalFeatureFormComponent,
    PhysicalFeatureComponent
  ],
  imports: [
    CommonModule,
    PhysicalFeaturesRoutingModule,

    SharedModule
  ]
})
export class PhysicalFeatureModule { }
