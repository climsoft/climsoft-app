import { PhysicalFeatureComponent } from './../../components/physical-feature/physical-feature.component';
import { FeatureClassesComponent } from './../../components/feature-classes/feature-classes.component';
import { of, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap/modal';

import { PhysicalFeature, PhysicalFeatureState, PhysicalFeatureClass } from './../../../../data/interface/physical-features';
import { PhysicalFeaturesService } from './../../services/physical-features.service';
import { ConfirmationComponent } from './../../../../shared/dialogs/confirmation/confirmation.component';
import { PhysicalFeatureFormComponent } from '../../components/physical-feature-form/physical-feature-form.component';
import { FeatureClassFormComponent } from '@physical-feature/components/feature-class-form/feature-class-form.component';


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
    const dialogRef: BsModalRef | undefined = this.modalService.show(PhysicalFeatureFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<PhysicalFeature>) => {
      if(payload) {
        this.physicalFeature.addFeature(payload).subscribe((res) => {
          if(!res.success && res.error) {
            dialogRef.content.error = res.message;
          } else {
            dialogRef.hide();
          }
        });
      }
    });
  }

  view(feature: PhysicalFeature) {
    const dialogConfig: ModalOptions = {
      initialState: { feature },
      class: 'modal-xl'
    };

    const dialogRef: BsModalRef | undefined = this.modalService.show(PhysicalFeatureComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((data: { action: string }) => {
      if(data.action && data.action === 'UPDATE_FEATURE') {
        this.update(feature);
      }
    });
  }

  update(pf: PhysicalFeature) {
    const dialogConfig: ModalOptions = {
      initialState: { feature: pf },
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const dialogRef: BsModalRef | undefined = this.modalService.show(PhysicalFeatureFormComponent, dialogConfig);
    dialogRef.content.onClose.subscribe((payload: Partial<PhysicalFeature>) => {
      if(payload) {
        this.physicalFeature.updateFeature(pf, payload).subscribe();
      }
    });
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

  viewClasses() {
    const dialogConfig: ModalOptions = {
      initialState: {},
      class: 'modal-lg',
      backdrop: 'static',
      keyboard: false
    };
    const classesDialog: BsModalRef | undefined = this.modalService.show(FeatureClassesComponent, dialogConfig);
    classesDialog.content.onClose.subscribe((action: { type: string, class?: PhysicalFeatureClass }) => {
      // switch(action.type) {
      //   case 'ADD_CLASS':
      //     this.addFeatureClass();
      //   break;
      //   case 'UPDATE_CLASS':
      //     if(action.class) {
      //       this.updateFeatureClass(action.class);
      //     }
      //   break;
      // }
    });
  }

  private addFeatureClass() {
    const dialogConfig: ModalOptions = {
      initialState: {},
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false
    };
    const classesDialog: BsModalRef | undefined = this.modalService.show(FeatureClassFormComponent, dialogConfig);
    classesDialog.content.onClose.subscribe((res: any) => {

    });
  }

  private updateFeatureClass(fc: PhysicalFeatureClass) {

  }
}
