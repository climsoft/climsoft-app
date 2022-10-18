import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationHistoryFormComponent } from './location-history-form.component';

describe('LocationHistoryFormComponent', () => {
  let component: LocationHistoryFormComponent;
  let fixture: ComponentFixture<LocationHistoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationHistoryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationHistoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
