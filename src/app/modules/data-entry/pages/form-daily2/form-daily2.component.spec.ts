import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDaily2Component } from './form-daily2.component';

describe('FormDaily2Component', () => {
  let component: FormDaily2Component;
  let fixture: ComponentFixture<FormDaily2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDaily2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDaily2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
