import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstrumentSelectionComponent } from './instrument-selection.component';

describe('InstrumentSelectionComponent', () => {
  let component: InstrumentSelectionComponent;
  let fixture: ComponentFixture<InstrumentSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstrumentSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstrumentSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
