import { ArchiveDefinitionFormComponent } from './../archive-definition-form/archive-definition-form.component';
import { PaperArchiveService } from '@paper-archive/services/paper-archive.service';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { PaperArchiveDefinition } from './../../../../data/interface/paper-archive';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { filter, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-archive-definitions',
  templateUrl: './archive-definitions.component.html',
  styleUrls: ['./archive-definitions.component.scss']
})
export class ArchiveDefinitionsComponent implements OnInit {
  public onClose: Subject<any> = new Subject();

  page: number = 1;
  limit: number = 10;
  definitions!: PaperArchiveDefinition[];

  constructor(
      private dialogRef: BsModalRef,
      private modalService: BsModalService,
      private archiveService: PaperArchiveService
    ) { }

  ngOnInit(): void {
    this.loadDefinitions();
  }

  onNew() {
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
              switchMap((payload: PaperArchiveDefinition) => this.archiveService.addDefinition(payload))
            )
            .subscribe(() => {
              this.loadDefinitions();
            });
  }

  updateDef(definition: PaperArchiveDefinition) {
    const dialogConfig: ModalOptions = {
      initialState: { definition },
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    };
    const classesDialog: BsModalRef | undefined = this.modalService.show(ArchiveDefinitionFormComponent, dialogConfig);
    classesDialog.content.onClose
            .pipe(
              filter((desc) => !!desc),
              switchMap((desc: string) => this.archiveService.updateDefinition(definition.form_id, desc))
            )
            .subscribe(() => {
              this.loadDefinitions();
            });
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.dialogRef.hide();
  }

  private loadDefinitions() {
    this.archiveService.getDefinitions(this.page, this.limit).subscribe((res) => {
      this.definitions = res.result;
    });
  }
}
