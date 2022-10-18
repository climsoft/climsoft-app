import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationElementsComponent } from './station-elements.component';

describe('StationElementsComponent', () => {
  let component: StationElementsComponent;
  let fixture: ComponentFixture<StationElementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationElementsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationElementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
