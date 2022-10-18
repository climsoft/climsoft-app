import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyDayFormGroupComponent } from './daily-day-form-group.component';

describe('DailyDayFormGroupComponent', () => {
  let component: DailyDayFormGroupComponent;
  let fixture: ComponentFixture<DailyDayFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DailyDayFormGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyDayFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
