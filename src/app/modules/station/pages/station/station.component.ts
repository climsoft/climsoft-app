import { Station } from 'src/app/data/interface/station';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import * as moment from "moment";

import {
  StationElement,
  StationElementsResponse,
  StationLocationHistory,
  StationLocationHistoryResponse,
  StationQualifierResponse
} from "@data/interface/station";
import { Qualifier } from "@data/interface/qualifier";
import { StationService } from "./../../services/station.service";
import { QualifierService } from "./../../../qualifier/services/qualifier.service";
import { LocationHistoryDialogComponent } from "./../../components/location-history-dialog/location-history-dialog.component";
import { StationElementDialogComponent } from "./../../components/station-element-dialog/station-element-dialog.component";
import { QualifierFormComponent } from "@qualifier/components/qualifier-form/qualifier-form.component";

@Component({
  selector: "app-station",
  templateUrl: "./station.component.html",
  styleUrls: ["./station.component.scss"]
})
export class StationComponent implements OnInit {
  station: any;
  stationName: string | undefined;
  id: any;
  raw!: Station | undefined;

  elements!: Observable<StationElementsResponse>;
  history!: Observable<StationLocationHistoryResponse>;
  qualifiers!: Observable<StationQualifierResponse>;

  constructor(
      private route: ActivatedRoute,
      private modalService: BsModalService,
      private stationService: StationService,
      private qualiferService: QualifierService
    ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      switchMap(p => {
        this.id = p['id'];
        return this.stationService.getStation(p['id'])
      })
    ).pipe(
      filter(res => res.result && res.result[0]),
      tap(res => {
        this.raw = res.result[0];
        this.stationName = res.result[0].station_name;
      }),
      map(res => this.stationService.adapt(res.result[0])),
      take(1)
    ).subscribe(st =>{
      this.station = st;
      this.loadElements();
      this.loadLocationHist();
      this.loadQualifiers();
    });
  }

  addElement() {
    const dialogConfig: ModalOptions = {
      initialState: { station: this.id },
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(StationElementDialogComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((data: any) => {
      if(data) {
        data.begin_date = moment(data.begin_date).format('YYYY-MM-DD');
        data.end_date = data.end_date? moment(data.end_date).format('YYYY-MM-DD') : null;
        this.stationService.addStationElement(data).subscribe((res) => {
          this.loadElements();
        });
      }
    });
  }

  updateElement(el: StationElement) {
    console.log(el);
    const { recorded_from, described_by, recorded_with, begin_date } = el;
    const dialogConfig: ModalOptions = {
      initialState: {
        station: this.id,
        stationElement: { ...el, obs_element: null }
      },
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(StationElementDialogComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((data: any) => {
      if(data) {
        this.stationService.updateStationElement({ recorded_from, described_by, recorded_with, begin_date }, data).subscribe(res => {
          console.log(res);
          this.loadElements();
        });
      }
    });
  }

  addLocHistory() {
    const dialogConfig: ModalOptions = {
      initialState: { station: this.id },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(LocationHistoryDialogComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((data: Partial<StationLocationHistory>) => {
      if(data) {
        this.stationService.addStationLocHistory(data).pipe(
            filter(res => res.result.length)
          )
          .subscribe(res => {
            this.loadLocationHist();
          });
      }
    });
  }

  editLocHistory(historyItem: any) {
    console.log(historyItem);
    const dialogConfig: ModalOptions = {
      initialState: { station: this.id, historyItem },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const { belongs_to, opening_datetime } = historyItem;
    const dialogRef: BsModalRef | undefined = this.modalService.show(LocationHistoryDialogComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((data: any) => {
      if(data) {
        // let payload: any = {};
        // Object.keys(historyItem)
        //       .filter(k => data[k] != historyItem[k])
        //       .forEach(k => {
        //         payload[k] = data[k]
        //       });
        this.stationService.updateStationLocHistory(belongs_to, opening_datetime, data)
            .subscribe(res => this.loadLocationHist());
      }
    });
  }

  addQualifier() {
    const dialogConfig: ModalOptions = {
      initialState: { qualifier: undefined, fromStation: this.raw },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(QualifierFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<Qualifier>) => {
      if(payload) {
        this.qualiferService.addQualifier(payload).subscribe(() => {
          this.loadQualifiers();
        });
      }
    });
  }

  editQualifier(qualifier: Qualifier) {
    const dialogConfig: ModalOptions = {
      initialState: { qualifier },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(QualifierFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Qualifier) => {
      if(payload) {
        this.qualiferService.updateQualifier(payload).subscribe();
      }
    });
  }

  private loadElements() {
    this.elements = this.stationService.getStationElements(this.id).pipe(
      map(res => ({ elements: res.result, page: res.page, pages: res.pages, limit: res.limit }))
    );
  }

  private loadLocationHist() {
    this.history = this.stationService.getStationLocHistory(this.id).pipe(
      map(res => ({ history: res.result, page: res.page, pages: res.pages, limit: res.limit }))
    );
  }

  private loadQualifiers() {
    this.qualifiers = this.stationService.getStationQualifiers(this.id).pipe(
      map(res => ({ qualifiers: res.result, page: res.page, pages: res.pages, limit: res.limit }))
    )
  }
}
