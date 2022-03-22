import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTimeComponent } from './date-time.component';

describe('DataTimeComponent', () => {
  let component: DataTimeComponent;
  let fixture: ComponentFixture<DataTimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataTimeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
