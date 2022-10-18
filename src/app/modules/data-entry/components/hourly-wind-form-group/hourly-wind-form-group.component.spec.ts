import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyWindFormGroupComponent } from './hourly-wind-form-group.component';

describe('HourlyWindFormGroupComponent', () => {
  let component: HourlyWindFormGroupComponent;
  let fixture: ComponentFixture<HourlyWindFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HourlyWindFormGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyWindFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
