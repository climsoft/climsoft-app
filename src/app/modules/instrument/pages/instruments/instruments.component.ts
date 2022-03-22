import { ConfirmationComponent } from './../../../../shared/dialogs/confirmation/confirmation.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { InstrumentService } from './../../services/instrument.service';
import { Instrument, InstrumentsState } from './../../../../data/interface/instrument';
import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-instruments',
  templateUrl: './instruments.component.html',
  styleUrls: ['./instruments.component.scss']
})
export class InstrumentsComponent implements OnInit {
  instruments$: Observable<InstrumentsState> = of({ instruments: [], limit: 1, page: 1, pages: 1 });

  constructor(
      private instService: InstrumentService,
      private modalService: BsModalService
    ) {}

  ngOnInit(): void {
    this.instruments$ = this.instService.instruments;
  }

  remove(inst: Instrument) {
    const config = {
      title: `Instrument Removal`,
      message: `Operation cannot be undone. Are you sure you want to remove the instrument and its associated data?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const confirmDialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    confirmDialogRef.content.onClose.subscribe((opt: boolean) => {
      if(opt && inst.instrument_id) {
        this.instService.removeInstrument(inst.instrument_id);
      }
    });
  }

  onPage(data: any) {
    console.log(data);
    this.instService.updateState(data);
  }

  createPages(count: number) {
    return [ ...Array(count).keys() ].map(k => k+1);
  }
}
