import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationElementFormComponent } from './station-element-form.component';

describe('StationElementFormComponent', () => {
  let component: StationElementFormComponent;
  let fixture: ComponentFixture<StationElementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationElementFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationElementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
