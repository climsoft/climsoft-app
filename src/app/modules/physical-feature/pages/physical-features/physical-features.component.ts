import { of, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { PhysicalFeature, PhysicalFeatureState } from './../../../../data/interface/physical-features';
import { PhysicalFeaturesService } from './../../services/physical-features.service';
import { ConfirmationComponent } from './../../../../shared/dialogs/confirmation/confirmation.component';
import { PhysicalFeatureFormComponent } from '../../components/physical-feature-form/physical-feature-form.component';


@Component({
  selector: 'app-physical-features',
  templateUrl: './physical-features.component.html',
  styleUrls: ['./physical-features.component.scss']
})
export class PhysicalFeaturesComponent implements OnInit {
  features$: Observable<PhysicalFeatureState> = of({ features: [], limit: 1, page: 1, pages: 1 });

  constructor(private modalService: BsModalService, private physicalFeature: PhysicalFeaturesService) { }

  ngOnInit(): void {
    this.features$ = this.physicalFeature.features;
  }

  onPage(data: any) {
    console.log(data);
    this.physicalFeature.updateState(data);
  }

  createPages(count: number) {
    return [ ...Array(count).keys() ].map(k => k+1);
  }

  add() {
    const dialogConfig: ModalOptions = {
      initialState: { feature: undefined },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const confirmDialogRef: BsModalRef | undefined = this.modalService.show(PhysicalFeatureFormComponent, dialogConfig);
    confirmDialogRef.content.onClose.subscribe((payload: Partial<PhysicalFeature>) => {
      if(payload) {
        this.physicalFeature.addFeature(payload).subscribe();
      }
    });
  }

  view(f: PhysicalFeature) {

  }

  update(f: PhysicalFeature) {

  }

  remove(feat: PhysicalFeature) {
    const config = {
      title: `Feature Removal`,
      message: `Operation cannot be undone. Are you sure you want to remove the physical feature and its associated data?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const confirmDialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    confirmDialogRef.content.onClose.subscribe((opt: boolean) => {
      if(opt && feat) {
        this.physicalFeature.removeFeature(feat);
      }
    });
  }
}
