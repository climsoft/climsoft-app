import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalFeatureComponent } from './physical-feature.component';

describe('PhysicalFeatureComponent', () => {
  let component: PhysicalFeatureComponent;
  let fixture: ComponentFixture<PhysicalFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
