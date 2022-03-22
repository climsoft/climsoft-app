import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationElementComponent } from './station-element.component';

describe('StationElementComponent', () => {
  let component: StationElementComponent;
  let fixture: ComponentFixture<StationElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
