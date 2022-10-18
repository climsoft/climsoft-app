import { SharedModule } from 'src/app/shared/shared.module';
import { PaperArchiveRoutingModule } from './paper-archive-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaperArchivesComponent } from './pages/paper-archives/paper-archives.component';
import { PaperArchiveFormComponent } from './components/paper-archive-form/paper-archive-form.component';

@NgModule({
  declarations: [
    PaperArchivesComponent,
    PaperArchiveFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,

    PaperArchiveRoutingModule
  ]
})
export class PaperArchiveModule { }
