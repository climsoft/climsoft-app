import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSynoptic2CaribbeanComponent } from './form-synoptic2-caribbean.component';

describe('FormSynoptic2CaribbeanComponent', () => {
  let component: FormSynoptic2CaribbeanComponent;
  let fixture: ComponentFixture<FormSynoptic2CaribbeanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormSynoptic2CaribbeanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormSynoptic2CaribbeanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
