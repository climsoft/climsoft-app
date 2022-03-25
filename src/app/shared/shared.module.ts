import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { NgxMaskModule } from 'ngx-mask';
import {
  AlertModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  NavModule,
  OffcanvasModule,
  PaginationModule,
  SidebarModule,
  SpinnerModule,
  TableModule,
  TabsModule,
  TooltipModule,
  UtilitiesModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { AlertComponent } from './dialogs/alert/alert.component';
import { ConfirmationComponent } from './dialogs/confirmation/confirmation.component';
import { PromptComponent } from './dialogs/prompt/prompt.component';
import { InfoBlockComponent } from './component/info-block/info-block.component';
import { PaginatorComponent } from './component/paginator/paginator.component';
import { StationSelectionComponent } from './component/station-selection/station-selection.component';
import { ElementSelectionComponent } from './component/element-selection/element-selection.component';
import { DataTimeComponent } from './component/data-time-selection/date-time.component';
import { NoValueComponent } from './component/no-value/no-value.component';
import { InstrumentSelectionComponent } from './component/instrument-selection/instrument-selection.component';

@NgModule({
  declarations: [
    ConfirmationComponent,
    AlertComponent,
    PromptComponent,
    InfoBlockComponent,
    PaginatorComponent,
    StationSelectionComponent,
    ElementSelectionComponent,
    DataTimeComponent,
    NoValueComponent,
    InstrumentSelectionComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    AlertModule,
    BreadcrumbModule,
    ButtonModule,
    ButtonGroupModule,
    CardModule,
    DropdownModule,
    FooterModule,
    FormModule,
    GridModule,
    HeaderModule,
    IconModule,
    ModalModule.forRoot(),
    NavModule,
    OffcanvasModule,
    PaginationModule,
    PerfectScrollbarModule,
    SpinnerModule,
    SidebarModule,
    TabsModule,
    TableModule,
    TooltipModule,
    UtilitiesModule,

    BsDatepickerModule.forRoot(),
    BsDropdownModule,
    TimepickerModule.forRoot(),
    TypeaheadModule.forRoot(),

    NgxMaskModule.forRoot()
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    NgxMaskModule,

    AlertModule,
    BreadcrumbModule,
    ButtonModule,
    ButtonGroupModule,
    CardModule,
    DropdownModule,
    FooterModule,
    FormModule,
    GridModule,
    HeaderModule,
    IconModule,
    NavModule,
    OffcanvasModule,
    PerfectScrollbarModule,
    SpinnerModule,
    SidebarModule,
    TabsModule,
    TableModule,
    TooltipModule,
    UtilitiesModule,

    BsDatepickerModule,
    TimepickerModule,

    //Shared Components
    InfoBlockComponent,
    NoValueComponent,

    //Shared Dialog Components
    AlertComponent,
    ConfirmationComponent,
    PaginatorComponent,
    PromptComponent,
    ElementSelectionComponent,
    InstrumentSelectionComponent,
    StationSelectionComponent,

    // Custom Form Components
    DataTimeComponent
  ]
})
export class SharedModule { }
