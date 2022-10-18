import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormHourlyComponent } from './form-hourly.component';

describe('FormHourlyComponent', () => {
  let component: FormHourlyComponent;
  let fixture: ComponentFixture<FormHourlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormHourlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormHourlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
