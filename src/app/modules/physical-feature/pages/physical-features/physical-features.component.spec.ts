import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalFeaturesComponent } from './physical-features.component';

describe('PhysicalFeaturesComponent', () => {
  let component: PhysicalFeaturesComponent;
  let fixture: ComponentFixture<PhysicalFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
