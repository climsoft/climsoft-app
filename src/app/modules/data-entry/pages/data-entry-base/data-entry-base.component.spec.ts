import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataEntryBaseComponent } from './data-entry-base.component';

describe('DataEntryBaseComponent', () => {
  let component: DataEntryBaseComponent;
  let fixture: ComponentFixture<DataEntryBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataEntryBaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataEntryBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
