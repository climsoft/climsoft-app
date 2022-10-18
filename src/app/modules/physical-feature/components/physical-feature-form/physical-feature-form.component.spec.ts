import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalFeatureFormComponent } from './physical-feature-form.component';

describe('PhysicalFeatureFormComponent', () => {
  let component: PhysicalFeatureFormComponent;
  let fixture: ComponentFixture<PhysicalFeatureFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalFeatureFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalFeatureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
