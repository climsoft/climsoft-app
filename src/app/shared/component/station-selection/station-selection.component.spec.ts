import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationSelectionComponent } from './station-selection.component';

describe('StationSelectionComponent', () => {
  let component: StationSelectionComponent;
  let fixture: ComponentFixture<StationSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
