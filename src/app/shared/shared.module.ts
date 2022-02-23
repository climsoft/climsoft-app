import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { ModalModule } from 'ngx-bootstrap/modal';

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
  PaginationModule,
  SidebarModule,
  SpinnerModule,
  TableModule,
  TooltipModule,
  UtilitiesModule
} from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { ConfirmationComponent } from './dialogs/confirmation/confirmation.component';
import { AlertComponent } from './dialogs/alert/alert.component';
import { PromptComponent } from './dialogs/prompt/prompt.component';
import { InfoBlockComponent } from './component/info-block/info-block.component';
import { PaginatorComponent } from './component/paginator/paginator.component';

@NgModule({
  declarations: [
    ConfirmationComponent,
    AlertComponent,
    PromptComponent,
    InfoBlockComponent,
    PaginatorComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

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
    PaginationModule,
    PerfectScrollbarModule,
    SpinnerModule,
    SidebarModule,
    TableModule,
    TooltipModule,
    UtilitiesModule,

    NgxMaskModule.forRoot()
  ],
  exports: [
    ReactiveFormsModule,

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
    PerfectScrollbarModule,
    SpinnerModule,
    SidebarModule,
    TableModule,
    TooltipModule,
    UtilitiesModule,

    //Shared Components
    InfoBlockComponent,

    //Shared Dialog Components
    PaginatorComponent,
    ConfirmationComponent,
    AlertComponent,
    PromptComponent,
    NgxMaskModule
  ]
})
export class SharedModule { }
