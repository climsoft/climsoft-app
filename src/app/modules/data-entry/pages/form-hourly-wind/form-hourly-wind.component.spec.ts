import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHourlyWindComponent } from './form-hourly-wind.component';

describe('FormHourlyWindComponent', () => {
  let component: FormHourlyWindComponent;
  let fixture: ComponentFixture<FormHourlyWindComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormHourlyWindComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHourlyWindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
