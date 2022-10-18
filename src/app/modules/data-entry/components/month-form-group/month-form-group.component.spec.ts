import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthFormGroupComponent } from './month-form-group.component';

describe('MonthFormGroupComponent', () => {
  let component: MonthFormGroupComponent;
  let fixture: ComponentFixture<MonthFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonthFormGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
