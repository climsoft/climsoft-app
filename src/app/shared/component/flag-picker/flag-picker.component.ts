import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef, Input } from '@angular/core';
import { Flag, Flags, FlagsConfig } from '@data/enum/flag';

@Component({
  selector: 'app-flag-picker',
  templateUrl: './flag-picker.component.html',
  styleUrls: ['./flag-picker.component.scss']
})
export class FlagPickerComponent implements OnInit {
  @Input() flag!: string;
  @Input() disabled: boolean = false;
  @Output() onSelect: EventEmitter<string> = new EventEmitter;

  flags: string[] = Flags;
  flagConfig: any = FlagsConfig;
  activeFlag: string = Flag.M;
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
    if(!this.disabled) {
      this.toggled = !this.toggled;
    }
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
