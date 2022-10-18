import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationHistoryDialogComponent } from './location-history-dialog.component';

describe('LocationHistoryDialogComponent', () => {
  let component: LocationHistoryDialogComponent;
  let fixture: ComponentFixture<LocationHistoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocationHistoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationHistoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
