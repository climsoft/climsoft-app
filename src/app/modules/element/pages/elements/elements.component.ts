import { ConfirmationComponent } from './../../../../shared/dialogs/confirmation/confirmation.component';
import { ObsElement } from 'src/app/data/interface/element';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ElementService } from './../../services/element.service';
import { ObsElementState } from './../../../../data/interface/element';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-elements',
  templateUrl: './elements.component.html',
  styleUrls: ['./elements.component.scss']
})
export class ElementsComponent implements OnInit {
  elements$: Observable<ObsElementState> = of({ elements: [], limit: 1, page: 1, pages: 1 });

  constructor(private elementService: ElementService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.elements$ = this.elementService.elements;
  }

  remove(el: ObsElement) {
    const config = {
      title: `Element Removal`,
      message: `Operation cannot be undone. Are you sure you want to remove the element and its associated data?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const confirmDialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    confirmDialogRef.content.onClose.subscribe((opt: boolean) => {
      if(opt && el.element_id) {
        this.elementService.removeElement(el.element_id);
      }
    });
  }

  onPage(data: any) {
    this.elementService.updateState(data);
  }

  createPages(count: number) {
    return [ ...Array(count).keys() ].map(k => k+1);
  }
}
