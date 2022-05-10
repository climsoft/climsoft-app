import { ArchiveViewerComponent } from './../../../../shared/component/archive-viewer/archive-viewer.component';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';

import { ConfirmationComponent } from '@shared/dialogs/confirmation/confirmation.component';
import { PaperArchiveFormComponent } from './../../components/paper-archive-form/paper-archive-form.component';
import { PaperArchive, PaperArchivesState } from '@data/interface/paper-archive';
import { PaperArchiveService } from './../../services/paper-archive.service';

@Component({
  selector: 'app-paper-archives',
  templateUrl: './paper-archives.component.html',
  styleUrls: ['./paper-archives.component.scss']
})
export class PaperArchivesComponent implements OnInit {
  state$: Observable<PaperArchivesState> = of({ archives: [], limit: 1, page: 1, pages: 1 });

  constructor(private modalService: BsModalService, private paperArchService: PaperArchiveService) { }

  ngOnInit(): void {
    this.state$ = this.paperArchService.archives;
  }

  onPage(data: any) {
    console.log(data);
    this.paperArchService.updateState(data);
  }

  createPages(count: number) {
    return [ ...Array(count).keys() ].map(k => k+1);
  }

  add() {
    const dialogConfig: ModalOptions = {
      initialState: { archive: undefined },
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(PaperArchiveFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<PaperArchive>) => {
      if(payload) {
        this.paperArchService.addArchive(payload).subscribe();
      }
    });
  }

  view(archive: PaperArchive) {
    const dialogConfig: ModalOptions = {
      initialState: { archive },
      class: 'modal-xl'
    };

    const dialogRef: BsModalRef | undefined = this.modalService.show(ArchiveViewerComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((data: { action: string }) => {
      if(data.action && data.action === 'UPDATE_ARCHIVE') {
        console.log('Update Archive to be implemented here');
      }
    })
  }

  update(pa: PaperArchive) {
    const dialogConfig: ModalOptions = {
      initialState: { archive: pa },
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(PaperArchiveFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<PaperArchive>) => {
      if(payload) {
        this.paperArchService.addArchive(payload).subscribe();
      }
    });
  }

  remove(feat: PaperArchive) {
    const config = {
      title: `Feature Removal`,
      message: `Operation cannot be undone. Are you sure you want to remove the physical feature and its associated data?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const confirmDialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    confirmDialogRef.content.onClose.subscribe((opt: boolean) => {
      if(opt && feat) {
        this.paperArchService.removeArchive(feat);
      }
    });
  }
}
