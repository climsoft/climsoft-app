import { Component, OnInit, Input, EventEmitter, Output, Optional, Self, OnDestroy } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-year-selector',
  templateUrl: './year-selector.component.html',
  styleUrls: ['./year-selector.component.scss']
})
export class YearSelectorComponent implements OnInit, OnDestroy {
  @Input() disabled: boolean = false;
  @Input() tabIndex: number = 0;
  @Input() value: number = new Date().getFullYear();
  @Input() start: number = new Date().getFullYear() - 30;
  @Input() end: number = new Date().getFullYear();

  formControl!: FormControl;
  @Output() onSelect: EventEmitter<number> = new EventEmitter();

  subscription!: Subscription;

  years: number[] = [];
  selectedIndex: any;

  constructor() {}

  ngOnInit(): void {
    this.formControl = new FormControl(this.value);
    for(let i = this.end; i > this.start; i--) {
      this.years.push(i);
    }

    this.subscription = this.formControl.valueChanges.subscribe((val) => {
      this.onSelect.emit(val);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
