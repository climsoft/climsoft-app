import { Component, OnInit, Output, EventEmitter, HostListener, ElementRef, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';
import { Flag, Flags, FlagsConfig } from '@data/enum/flag';

@Component({
  selector: 'app-flag-picker',
  templateUrl: './flag-picker.component.html',
  styleUrls: ['./flag-picker.component.scss']
})
export class FlagPickerComponent implements OnInit, OnChanges {
  @Input() flag!: string;
  @Input() disabled: boolean = false;
  @Output() onSelect: EventEmitter<string> = new EventEmitter;

  flags: string[] = Flags;
  flagConfig: any = FlagsConfig;
  activeFlag: string = 'N';
  toggled: boolean = false;

  constructor(private _eref: ElementRef) { }

  @HostListener('document:click', ['$event']) onDocumentClick(event: any) {
    event.stopPropagation();
    if (!this._eref.nativeElement.contains(event.target)) {
      this.toggled = false;
    }
  }

  ngOnInit(): void {}

  ngOnChanges(changes: any): void {
    if(changes.flag && changes.flag.currentValue) {
      this.activeFlag = changes.flag.currentValue;
    }
  }

  toggleActive() {
    if(!this.disabled) {
      this.toggled = !this.toggled;
    }
  }

  selectFlag(char: string) {
    this.activeFlag = char;
    this.toggled = false;
    this.onSelect.emit(char);
  }

  get activeLabel(): string {
    return this.flagConfig[this.activeFlag].label;
  }

  get filteredFlags(): string[] {
    return this.flags.filter(f => f !== 'N');
  }
}
