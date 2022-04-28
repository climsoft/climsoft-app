import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlagLegendComponent } from './flag-legend.component';

describe('FlagLegendComponent', () => {
  let component: FlagLegendComponent;
  let fixture: ComponentFixture<FlagLegendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlagLegendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlagLegendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
