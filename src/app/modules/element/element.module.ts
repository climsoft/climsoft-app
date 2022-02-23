import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElementsComponent } from './pages/elements/elements.component';
import { ElementComponent } from './pages/element/element.component';
import { ElementFormComponent } from './pages/element-form/element-form.component';

import { ElementRoutingModule } from './element-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    ElementsComponent,
    ElementComponent,
    ElementFormComponent
  ],
  imports: [
    CommonModule,
    ElementRoutingModule,
    SharedModule
  ]
})
export class ElementModule { }
