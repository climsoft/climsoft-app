import { Component, OnInit } from '@angular/core';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { filter, of, switchMap, Observable } from 'rxjs';

import { PaperArchiveDefinition } from '@data/interface/paper-archive';
import { PaperArchiveDefinitionState } from '@data/interface/paper-archive';
import { ArchiveDefinitionService } from './../../services/archive-definition.service';
import { ArchiveDefinitionFormComponent } from '../../components/archive-definition-form/archive-definition-form.component';
import { ConfirmationComponent } from '@shared/dialogs/confirmation/confirmation.component';

@Component({
  selector: 'app-archive-definitions',
  templateUrl: './archive-definitions.component.html',
  styleUrls: ['./archive-definitions.component.scss']
})
export class ArchiveDefinitionsComponent implements OnInit {
  page: number = 1;
  limit: number = 10;
  state$: Observable<PaperArchiveDefinitionState> = of({ definitions: [], limit: 1, page: 1, pages: 1 });

  constructor(
      private modalService: BsModalService,
      private defService: ArchiveDefinitionService
    ) { }

  ngOnInit(): void {
    this.state$ = this.defService.definitions;
  }

  add() {
    const dialogConfig: ModalOptions = {
      initialState: {},
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    };
    const formDialog: BsModalRef | undefined = this.modalService.show(ArchiveDefinitionFormComponent, dialogConfig);
    formDialog.content.onClose
            .pipe(
              filter((payload) => !!payload),
              switchMap((payload: PaperArchiveDefinition) => this.defService.addDefinition(payload))
            )
            .subscribe();
  }

  update(definition: PaperArchiveDefinition) {
    const dialogConfig: ModalOptions = {
      initialState: { definition },
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    };
    const formDialog: BsModalRef | undefined = this.modalService.show(ArchiveDefinitionFormComponent, dialogConfig);
    formDialog.content.onClose
        .pipe(
          filter((desc) => !!desc),
          switchMap((description: string) => this.defService.updateDefinition(definition.form_id, { description }))
        )
        .subscribe();
  }

  remove(def: PaperArchiveDefinition) {
    const config = {
      title: `Archive Definition Removal`,
      message: `Operation cannot be undone. Are you sure you want to remove the selected archive definition?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const confirmDialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    confirmDialogRef.content.onClose.subscribe((opt: boolean) => {
      if(opt) {
        this.defService.removeDefinition(def.form_id);
      }
    });
  }

  onPage(data: any) {
    console.log(data);
    this.defService.updateState(data);
  }

  createPages(count: number) {
    return [ ...Array(count).keys() ].map(k => k+1);
  }
}
