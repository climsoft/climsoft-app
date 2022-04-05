import { Component, OnInit } from '@angular/core';
import { of, Observable } from 'rxjs';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

import { LocHistoryService } from './../../services/loc-history.service';

import { LocationHistoriesState } from './../../../../data/interface/location-history';
import { StationLocationHistory } from 'src/app/data/interface/station';
import { ConfirmationComponent } from './../../../../shared/dialogs/confirmation/confirmation.component';
import { getStationTypeText } from 'src/app/data/enum/station';


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

  remove(hist: StationLocationHistory) {
    const config = {
      title: `Location History Removal`,
      message: `Operation cannot be undone. Are you sure you want to remove the location history and its associated data?`,
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
}
