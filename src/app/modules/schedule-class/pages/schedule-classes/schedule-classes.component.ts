import { Component, OnInit } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';

import { SchedClassUpdatePayload, ScheduleClass, ScheduleClassState } from '@data/interface/schedule-class';
import { ConfirmationComponent } from '@shared/dialogs/confirmation/confirmation.component';
import { ScheduleClassFormComponent } from './../../components/schedule-class-form/schedule-class-form.component';
import { ScheduleClassService } from './../../services/schedule-class.service';

@Component({
  selector: 'app-schedule-classes',
  templateUrl: './schedule-classes.component.html',
  styleUrls: ['./schedule-classes.component.scss']
})
export class ScheduleClassesComponent implements OnInit {
  page: number = 1;
  limit: number = 10;
  state$: Observable<ScheduleClassState> = of({ classes: [], limit: 1, page: 1, pages: 1 });

  constructor(
      private modalService: BsModalService,
      private schClassService: ScheduleClassService
    ) { }

  ngOnInit(): void {
    this.state$ = this.schClassService.definitions;
  }

  add(repeatPayload?: any, error?: string) {
    const dialogConfig: ModalOptions = {
      initialState: { repeatPayload, error },
      class: 'modal-md',
      backdrop: 'static',
      keyboard: false
    };
    const formDialog: BsModalRef | undefined = this.modalService.show(ScheduleClassFormComponent, dialogConfig);
    let payload: any = null;
    formDialog.content.onClose
            .pipe(
              filter((data) => !!data),
              tap((data) => payload = data),
              switchMap((payload: ScheduleClass) => this.schClassService.addClass(payload))
            )
            .subscribe((res: any) => {
              console.log(res);
              if(res.status === 'error') {
                this.add(payload, res.message);
              }
            });
  }

  update(scheduleClass: ScheduleClass) {
    const dialogConfig: ModalOptions = {
      initialState: { scheduleClass },
      class: 'modal-sm',
      backdrop: 'static',
      keyboard: false
    };
    const formDialog: BsModalRef | undefined = this.modalService.show(ScheduleClassFormComponent, dialogConfig);
    formDialog.content.onClose
        .pipe(
          filter((data) => !!data),
          switchMap((payload: SchedClassUpdatePayload) => this.schClassService.updateClass(scheduleClass.schedule_class, payload))
        )
        .subscribe();
  }

  remove(cl: ScheduleClass) {
    const config = {
      title: `Schedule Class Removal`,
      message: `Operation cannot be undone. Are you sure you want to remove the selected schedule class?`,
      confirm: 'Go Ahead',
      cancel: 'Cancel'
    };
    const confirmDialogRef: BsModalRef | undefined = this.modalService.show(ConfirmationComponent, { initialState: config });
    confirmDialogRef.content.onClose.subscribe((opt: boolean) => {
      if(opt) {
        this.schClassService.removeClass(cl.schedule_class);
      }
    });
  }

  onPage(data: any) {
    console.log(data);
    this.schClassService.updateState(data);
  }

  createPages(count: number) {
    return [ ...Array(count).keys() ].map(k => k+1);
  }
}
