import { Component, forwardRef, OnInit, Input, ElementRef, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ToastComponent, ToasterService } from '@coreui/angular';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  providers: [{ provide: ToastComponent, useExisting: forwardRef(() => AppToastComponent) }]
})
export class AppToastComponent extends ToastComponent {
  @Input() closeButton = true;
  @Input() title = '';

  constructor(
    public override hostElement: ElementRef,
    public override renderer: Renderer2,
    public override toasterService: ToasterService,
    public override changeDetectorRef: ChangeDetectorRef
  ) {
    super(hostElement, renderer, toasterService, changeDetectorRef);
  }
}
