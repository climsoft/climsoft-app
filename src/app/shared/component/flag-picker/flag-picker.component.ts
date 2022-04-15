import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-flag-picker',
  templateUrl: './flag-picker.component.html',
  styleUrls: ['./flag-picker.component.scss']
})
export class FlagPickerComponent implements OnInit {
  @Output() onSelect: EventEmitter<string> = new EventEmitter;

  flags: string[] = ['M', 'T', 'E', 'G', 'D'];
  flagConfig: any = {
    M: { label: 'Missing', class: 'btn-light' },
    T: { label: 'Trace', class: 'btn-dark' },
    E: { label: 'Estimated', class: 'btn-secondary' },
    G: { label: 'Generated', class: 'btn-info' },
    D: { label: 'Dubious', class: 'btn-warning' }
  };
  activeFlag: string = this.flags[0];
  toggled: boolean = false;

  constructor(private _eref: ElementRef) { }

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    event.stopPropagation();
    if (!this._eref.nativeElement.contains(event.target)) {
      this.toggled = false;
    }
  }

  ngOnInit(): void {
  }

  toggleActive() {
    this.toggled = !this.toggled;
  }

  get activeLabel(): string {
    return this.flagConfig[this.activeFlag].label;
  }

  selectFlag(char: string) {
    console.log(char);
    this.activeFlag = char;
    this.toggled = false;
  }
}
