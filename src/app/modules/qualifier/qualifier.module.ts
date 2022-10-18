import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from './../../shared/shared.module';
import { QualifierRoutingModule } from './qualifier-routing.module';
import { QualifiersComponent } from './pages/qualifiers/qualifiers.component';
import { QualifierComponent } from './pages/qualifier/qualifier.component';
import { QualifierFormComponent } from './components/qualifier-form/qualifier-form.component';


@NgModule({
  declarations: [
    QualifiersComponent,
    QualifierComponent,
    QualifierFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

    QualifierRoutingModule
  ]
})
export class QualifierModule { }
