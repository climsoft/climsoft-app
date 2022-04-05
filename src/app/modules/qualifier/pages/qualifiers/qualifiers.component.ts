import { ConfirmationComponent } from './../../../../shared/dialogs/confirmation/confirmation.component';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { QualifierService } from './../../services/qualifier.service';
import { QualifiersState } from './../../../../data/interface/qualifier';
import { Qualifier } from './../../../../data/interface/qualifier';
import { QualifierFormComponent } from '../../components/qualifier-form/qualifier-form.component';

@Component({
  selector: 'app-qualifiers',
  templateUrl: './qualifiers.component.html',
  styleUrls: ['./qualifiers.component.scss']
})
export class QualifiersComponent implements OnInit {
  qualifiers$: Observable<QualifiersState> = of({ qualifiers: [], limit: 1, page: 1, pages: 1 });

  submitted = false;
  loading: boolean = false;
  error = false;

  id: any;
  isUpdate = false;

  constructor(
    private modalService: BsModalService,
    private qualiferService: QualifierService
  ) {}

  ngOnInit(): void {
    this.qualifiers$ = this.qualiferService.qualifiers;
  }

  remove(qual: Qualifier) {
    const config = {
      title: `Qualifier Removal`,
      message: `Operation cannot be undone. Are you sure you want to remove the qualifier record?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const confirmDialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    confirmDialogRef.content.onClose.subscribe((opt: boolean) => {
      // if(opt && hist.id) {
      //   this.locHistService.remove(hist.id);
      // }
    });
  }

  onPage(data: any) {
    console.log(data);
    this.qualiferService.updateState(data);
  }

  createPages(count: number) {
    return [ ...Array(count).keys() ].map(k => k+1);
  }

  addNew() {
    const dialogConfig: ModalOptions = {
      initialState: { qualifier: undefined },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(QualifierFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<Qualifier>) => {
      if(payload) {
        this.qualiferService.addQualifier(payload).subscribe();
      }
    });
  }

  update(qualifier: Qualifier) {
    const dialogConfig: ModalOptions = {
      initialState: { qualifier },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(QualifierFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<Qualifier>) => {
      if(payload) {
        this.qualiferService.addQualifier(payload).subscribe();
      }
    });
  }

  view(q: Qualifier) {
  }
}
