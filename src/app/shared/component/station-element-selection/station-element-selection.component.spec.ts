import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationElementSelectionComponent } from './station-element-selection.component';

describe('StationElementSelectionComponent', () => {
  let component: StationElementSelectionComponent;
  let fixture: ComponentFixture<StationElementSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationElementSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationElementSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
