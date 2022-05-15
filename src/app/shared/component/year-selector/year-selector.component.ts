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

  formControl!: FormControl;
  @Output() onSelect: EventEmitter<number> = new EventEmitter();

  subscription!: Subscription;

  years: number[] = [];
  selectedIndex: any;


  constructor() {}

  ngOnInit(): void {
    this.formControl = new FormControl(this.value);
    const yr = new Date().getFullYear();
    for(let i = yr; i > yr-50; i--) {
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
