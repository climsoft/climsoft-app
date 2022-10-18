import { FeatureClassFormComponent } from '@physical-feature/components/feature-class-form/feature-class-form.component';
import { PhysicalFeatureClass } from './../../../../data/interface/physical-features';
import { PhysicalFeaturesService } from './../../services/physical-features.service';
import { Subject, Observable, switchMap, filter } from 'rxjs';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-feature-classes',
  templateUrl: './feature-classes.component.html',
  styleUrls: ['./feature-classes.component.scss']
})
export class FeatureClassesComponent implements OnInit {

  classes$!: Observable<PhysicalFeatureClass[]>;

  public onClose: Subject<any> = new Subject();

  constructor(
    private dialogRef: BsModalRef,
    private modalService: BsModalService,
    private featureService: PhysicalFeaturesService) { }

  ngOnInit(): void {
    this.loadClasses();
  }

  edit(item: PhysicalFeatureClass) {
    this.onClose.next({ type: 'UPDATE_CLASS', class: item });
    this.dialogRef.hide();
  }

  // public onNew(): void {
  //   this.onClose.next({ type: 'ADD_CLASS' });
  //   this.dialogRef.hide();
  // }

  public onNew() {
    const dialogConfig: ModalOptions = {
      initialState: {},
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    };
    const classesDialog: BsModalRef | undefined = this.modalService.show(FeatureClassFormComponent, dialogConfig);
    classesDialog.content.onClose
            .pipe(
              filter((payload) => !!payload),
              switchMap((payload: PhysicalFeatureClass) => this.featureService.addFeatureClass(payload))
            )
            .subscribe(() => {
              this.loadClasses();
            });
  }

  private updateFeatureClass(fc: PhysicalFeatureClass) {
    const dialogConfig: ModalOptions = {
      initialState: { featureClass: fc },
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    };
    const classesDialog: BsModalRef | undefined = this.modalService.show(FeatureClassFormComponent, dialogConfig);
    classesDialog.content.onClose
            .pipe(
              filter((payload) => !!payload),
              switchMap((payload: PhysicalFeatureClass) => this.featureService.updateFeatureClass(payload))
            )
            .subscribe(() => {
              this.loadClasses();
            });
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.dialogRef.hide();
  }

  private loadClasses() {
    this.classes$ = this.featureService.getFeatureClasses();
  }
}
