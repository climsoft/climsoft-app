import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { ArchiveDefinitionsComponent } from './pages/archive-definitions/archive-definitions.component';

const routes: Routes = [
  {
    path: '',
    component: ArchiveDefinitionsComponent,
    data: {
      title: 'Paper Archive Definitions'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArchiveDefinitionRoutingModule { }
