import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSynopticRaComponent } from './form-synoptic-ra.component';

describe('FormSynopticRaComponent', () => {
  let component: FormSynopticRaComponent;
  let fixture: ComponentFixture<FormSynopticRaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSynopticRaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSynopticRaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
