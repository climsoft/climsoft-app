import { ConfirmationComponent } from './../../../../shared/dialogs/confirmation/confirmation.component';
import { Observable, of } from 'rxjs';
import { StationService } from './../../services/station.service';
import { Component, OnInit } from '@angular/core';
import { Station, StationsState } from 'src/app/data/interface/station';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-stations',
  templateUrl: './stations.component.html',
  styleUrls: ['./stations.component.scss']
})
export class StationsComponent implements OnInit {

  stations$: Observable<StationsState> = of({ stations: [], limit: 1, page: 1, pages: 1 });
  // stations$: Observable<Station[]> = of([]);

  constructor(private stationService: StationService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.stations$ = this.stationService.stations;
  }

  remove(st: Station) {
    const config = {
      title: `Station Removal`,
      message: `Operation cannot be undone. Are you sure you want to remove the station and its associated data?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const confirmDialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    confirmDialogRef.content.onClose.subscribe((opt: boolean) => {
      if(opt && st.station_id) {
        this.stationService.removeStation(st.station_id);
      }
    });
  }

  onPage(data: any) {
    console.log(data);
    this.stationService.updateState(data);
  }

  createPages(count: number) {
    return [ ...Array(count).keys() ].map(k => k+1);
  }
}
