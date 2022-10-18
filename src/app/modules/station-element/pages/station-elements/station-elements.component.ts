import { StationElementFormComponent } from './../../components/station-element-form/station-element-form.component';
import { StationElementsState } from './../../../../data/interface/station-element';
import { Observable, of } from 'rxjs';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap/modal';
import { StationElementService } from './../../services/station-element.service';
import { Component, OnInit } from '@angular/core';
import { StationElement } from '@data/interface/station';

@Component({
  selector: 'app-station-elements',
  templateUrl: './station-elements.component.html',
  styleUrls: ['./station-elements.component.scss']
})
export class StationElementsComponent implements OnInit {
  stationElements$: Observable<StationElementsState> = of({ elements: [], limit: 1, page: 1, pages: 1 });

  constructor(private stElementsService: StationElementService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.stationElements$ = this.stElementsService.stationElements$;
  }

  onPage(data: any) {
    console.log(data);
    this.stElementsService.updateState(data);
  }

  createPages(count: number) {
    return [ ...Array(count).keys() ].map(k => k+1);
  }

  addNew() {
    const dialogConfig: ModalOptions = {
      initialState: { stationElement: undefined },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(StationElementFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<StationElement>) => {
      if(payload) {
        this.stElementsService.addStElement(payload).subscribe();
      }
    });
  }

  preview(sel: any) {}

  edit(stationElement: StationElement) {
    const dialogConfig: ModalOptions = {
      initialState: { stationElement },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(StationElementFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<StationElement>) => {
      if(payload) {
        this.stElementsService.updateStElement(payload).subscribe();
      }
    });
  }

  remove(sel: any) {}
}
