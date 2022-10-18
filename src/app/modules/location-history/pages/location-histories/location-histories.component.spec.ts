import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationHistoriesComponent } from './location-histories.component';

describe('LocationHistoriesComponent', () => {
  let component: LocationHistoriesComponent;
  let fixture: ComponentFixture<LocationHistoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationHistoriesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
