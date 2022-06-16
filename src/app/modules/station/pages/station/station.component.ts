import { PhysicalFeatureComponent } from './../../../physical-feature/components/physical-feature/physical-feature.component';
import { ArchiveViewerComponent } from './../../../../shared/component/archive-viewer/archive-viewer.component';
import { PaperArchiveFormComponent } from './../../../paper-archive/components/paper-archive-form/paper-archive-form.component';
import { PhysicalFeatureFormComponent } from './../../../physical-feature/components/physical-feature-form/physical-feature-form.component';
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, map, switchMap, take, tap, delay } from "rxjs/operators";
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap/modal";
import * as moment from "moment";

import { PaperArchiveService } from '@paper-archive/services/paper-archive.service';
import { PhysicalFeaturesService } from '@physical-feature/services/physical-features.service';
import { PhysicalFeature, PhysicalFeatureState } from '@data/interface/physical-features';
import { Station } from '@data/interface/station';

import {
  StationElement,
  StationElementsResponse,
  StationLocationHistory,
  StationLocationHistoryResponse,
  StationQualifierResponse
} from "@data/interface/station";
import { Qualifier } from "@data/interface/qualifier";
import { PaperArchive, PaperArchivesState } from '@data/interface/paper-archive';
import { StationService } from "./../../services/station.service";
import { QualifierService } from "@qualifier/services/qualifier.service";
import { QualifierFormComponent } from "@qualifier/components/qualifier-form/qualifier-form.component";
import { LocationHistoryDialogComponent } from "./../../components/location-history-dialog/location-history-dialog.component";
import { StationElementDialogComponent } from "./../../components/station-element-dialog/station-element-dialog.component";
import { StationElementFormComponent } from '@station-element/components/station-element-form/station-element-form.component';


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
  physicalFeatures!: Observable<PhysicalFeatureState>;
  paperArchives!: Observable<PaperArchivesState>;

  loading = true;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private modalService: BsModalService,
      private stationService: StationService,
      private qualiferService: QualifierService,
      private physFeatureService: PhysicalFeaturesService,
      private archiveService: PaperArchiveService
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
      this.loadPhysicalFeatures();
      this.loadPaperArchive();
    });
  }

  edit() {
    this.router.navigateByUrl(`/station/${this.id}/update`);
  }

  addElement() {
    const dialogConfig: ModalOptions = {
      initialState: { fromStation: this.raw },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(StationElementFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<StationElement>) => {
      if(payload) {
        this.stationService.addStationElement(payload).subscribe((res) => {
          this.loadElements();
        });
      }
    });
  }

  updateElement(stationElement: StationElement) {
    console.log(stationElement);
    const dialogConfig: ModalOptions = {
      initialState: { stationElement },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(StationElementFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<StationElement>) => {
      if(payload) {
        const params = {
          recorded_from: this.id,
          described_by: stationElement.described_by,
          recoded_with: stationElement.recorded_with,
          begin_date: stationElement.begin_date
        };
        this.stationService.updateStationElement(params, payload).subscribe(() => {
          this.loadElements();
        });
      }
    });
  }

  addLocHistory() {
    const dialogConfig: ModalOptions = {
      initialState: { fromStation: this.id },
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
    const dialogConfig: ModalOptions = {
      initialState: { historyItem },
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

  addPhysicalFeature() {
    const dialogConfig: ModalOptions = {
      initialState: { feature: undefined, fromStation: this.id },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(PhysicalFeatureFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<PhysicalFeature>) => {
      if(payload) {
        this.physFeatureService.addFeature(payload)
            .pipe(
              delay(500)
            )
            .subscribe(() => {
              dialogRef.hide();
              this.loadPhysicalFeatures();
            });
      }
    });
  }

  editPhysicalFeature(pf: PhysicalFeature) {
    const dialogConfig: ModalOptions = {
      initialState: { feature: pf },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(PhysicalFeatureFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<PhysicalFeature>) => {
      if(payload) {
        this.physFeatureService.updateFeature(pf, payload).subscribe();
      }
    });
  }

  viewPhysicalFeature(feature: PhysicalFeature) {
    const dialogConfig: ModalOptions = {
      initialState: { feature },
      class: 'modal-xl'
    };

    const dialogRef: BsModalRef | undefined = this.modalService.show(PhysicalFeatureComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((data: { action: string }) => {
      if(data.action && data.action === 'UPDATE_FEATURE') {
        this.editPhysicalFeature(feature);
      }
    });
  }

  addPaperArchive() {
    const dialogConfig: ModalOptions = {
      initialState: { archive: undefined, fromStation: this.raw },
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(PaperArchiveFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<PaperArchive>) => {
      if(payload) {
        this.archiveService.addArchive(payload).subscribe(() => {
          this.loadPaperArchive();
        });
      }
    });
  }

  viewPaperArchive(archive: PaperArchive) {
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

  editPaperArchive(pa: PaperArchive) {
    const dialogConfig: ModalOptions = {
      initialState: { archive: pa },
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(PaperArchiveFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<PaperArchive>) => {
      if(payload) {
        this.archiveService.updateArchive(pa, payload).subscribe();
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

  private loadPhysicalFeatures() {
    this.physicalFeatures = this.physFeatureService.getByStation(this.id).pipe(
      map(res => ({ features: res.result, page: res.page, pages: res.pages, limit: res.limit }))
    );
  }

  private loadPaperArchive() {
    this.paperArchives = this.archiveService.getStationArchives(this.id).pipe(
      map(res => ({ archives: res.result, page: res.page, pages: res.pages, limit: res.limit })),
      tap(() => {
        this.loading = false;
      })
    );
  }
}
