import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstrumentsComponent } from './pages/instruments/instruments.component';
import { InstrumentComponent } from './pages/instrument/instrument.component';
import { InstrumentFormComponent } from './pages/instrument-form/instrument-form.component';
import { InstrumentRoutingModule } from './instrument-routing.module';


@NgModule({
  declarations: [
    InstrumentsComponent,
    InstrumentComponent,
    InstrumentFormComponent
  ],
  imports: [
    CommonModule,
    InstrumentRoutingModule,

    SharedModule
  ]
})
export class InstrumentModule { }
