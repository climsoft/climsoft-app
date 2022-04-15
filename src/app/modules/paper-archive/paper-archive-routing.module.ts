import { PaperArchivesComponent } from './pages/paper-archives/paper-archives.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: PaperArchivesComponent,
    data: {
      title: 'Paper Archives'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaperArchiveRoutingModule { }
