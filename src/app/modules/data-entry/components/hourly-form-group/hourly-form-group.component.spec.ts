import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HourlyFormGroupComponent } from './hourly-form-group.component';

describe('HourlyFormGroupComponent', () => {
  let component: HourlyFormGroupComponent;
  let fixture: ComponentFixture<HourlyFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HourlyFormGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HourlyFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
