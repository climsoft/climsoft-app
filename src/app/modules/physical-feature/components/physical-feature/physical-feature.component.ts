import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Component, OnInit, Input } from '@angular/core';
import { PhysicalFeature } from '@data/interface/physical-features';

const apiPrefix = `climsoft/`;

@Component({
  selector: 'app-physical-feature',
  templateUrl: './physical-feature.component.html',
  styleUrls: ['./physical-feature.component.scss']
})
export class PhysicalFeatureComponent implements OnInit {
  @Input() feature!: PhysicalFeature | undefined;

  public onClose: Subject<boolean | { action: string }> = new Subject();

  constructor(private dialogRef: BsModalRef) { }

  ngOnInit(): void {}

  public onUpdate(): void {
    this.onClose.next({ action: 'UPDATE_FEATURE' });
    this.dialogRef.hide();
  }

  public onCancel(): void {
    this.onClose.next(false);
    this.dialogRef.hide();
  }

  get imageSrc(): string {
    return `${apiPrefix}${this.feature?.image}`;
  }
}
