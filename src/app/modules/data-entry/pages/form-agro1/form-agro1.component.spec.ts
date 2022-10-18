import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAgro1Component } from './form-agro1.component';

describe('FormAgro1Component', () => {
  let component: FormAgro1Component;
  let fixture: ComponentFixture<FormAgro1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormAgro1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormAgro1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
