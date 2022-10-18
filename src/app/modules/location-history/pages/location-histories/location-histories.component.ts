import { Component, OnInit } from '@angular/core';
import { of, Observable, filter } from 'rxjs';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { LocationHistoriesState } from '@data/interface/location-history';
import { StationLocationHistory } from '@data/interface/station';
import { getStationTypeText } from '@data/enum/station';
import { LocationHistoryDialogComponent } from '@station/components/location-history-dialog/location-history-dialog.component';
import { LocHistoryService } from './../../services/loc-history.service';
import { ConfirmationComponent } from '@shared/dialogs/confirmation/confirmation.component';

@Component({
  selector: 'app-location-histories',
  templateUrl: './location-histories.component.html',
  styleUrls: ['./location-histories.component.scss']
})
export class LocationHistoriesComponent implements OnInit {
  histories$: Observable<LocationHistoriesState> = of({ locationHistories: [], limit: 1, page: 1, pages: 1 });

  submitted = false;
  loading: boolean = false;
  error = false;

  id: any;
  isUpdate = false;

  constructor(
    private modalService: BsModalService,
    private locHistService: LocHistoryService
  ) {}

  ngOnInit(): void {
    this.histories$ = this.locHistService.histories;
  }

  onPage(data: any) {
    console.log(data);
    this.locHistService.updateState(data);
  }

  createPages(count: number) {
    return [ ...Array(count).keys() ].map(k => k+1);
  }

  viewLocHist(lh: StationLocationHistory) {
  }

  getStationTypeText(t: string): string {
    return getStationTypeText(t);
  }

  add() {
    const dialogConfig: ModalOptions = {
      initialState: { station: this.id },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(LocationHistoryDialogComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((data: Partial<StationLocationHistory>) => {
      if(data) {
        this.locHistService.addNew(data)
            .pipe(
              filter((res: any) => res.result.length)
            )
            .subscribe(() => {
              dialogRef.hide();
            });
      }
    });
  }

  update(item: StationLocationHistory) {
    const dialogConfig: ModalOptions = {
      initialState: { station: item.belongs_to, historyItem: item },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(LocationHistoryDialogComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((data: Partial<StationLocationHistory>) => {
      console.log(data);
      if(data) {
        this.locHistService.update(+item.belongs_to, new Date(item.opening_datetime).toISOString(), data)
            .pipe(
              filter((res: any) => res.result.length)
            )
            .subscribe(() => {
              dialogRef.hide();
            });
      }
    });
  }

  remove(hist: StationLocationHistory) {
    const config = {
      title: `Location History Removal`,
      message: `Operation cannot be undone. Are you sure you want to remove the location history and its associated data?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const confirmDialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    confirmDialogRef.content.onClose.subscribe((opt: boolean) => {
      if(opt) {
        this.locHistService.remove(+hist.belongs_to, new Date(hist.opening_datetime).toISOString()).subscribe();
      }
    });
  }
}
