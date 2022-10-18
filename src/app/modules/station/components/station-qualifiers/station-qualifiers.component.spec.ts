import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationQualifiersComponent } from './station-qualifiers.component';

describe('StationQualifiersComponent', () => {
  let component: StationQualifiersComponent;
  let fixture: ComponentFixture<StationQualifiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationQualifiersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationQualifiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
