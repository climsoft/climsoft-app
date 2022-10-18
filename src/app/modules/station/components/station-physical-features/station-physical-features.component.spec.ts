import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationPhysicalFeaturesComponent } from './station-physical-features.component';

describe('StationPhysicalFeaturesComponent', () => {
  let component: StationPhysicalFeaturesComponent;
  let fixture: ComponentFixture<StationPhysicalFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationPhysicalFeaturesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationPhysicalFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
