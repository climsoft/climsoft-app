import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMonthlyComponent } from './form-monthly.component';

describe('FormMonthlyComponent', () => {
  let component: FormMonthlyComponent;
  let fixture: ComponentFixture<FormMonthlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormMonthlyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormMonthlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
