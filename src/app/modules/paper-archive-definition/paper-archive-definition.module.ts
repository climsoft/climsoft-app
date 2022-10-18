import { ArchiveDefinitionRoutingModule } from './archive-definition-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArchiveDefinitionsComponent } from './pages/archive-definitions/archive-definitions.component';
import { ArchiveDefinitionFormComponent } from './components/archive-definition-form/archive-definition-form.component';



@NgModule({
  declarations: [
    ArchiveDefinitionsComponent,
    ArchiveDefinitionFormComponent
  ],
  imports: [
    CommonModule,
    ArchiveDefinitionRoutingModule,
    SharedModule
  ]
})
export class PaperArchiveDefinitionModule { }
