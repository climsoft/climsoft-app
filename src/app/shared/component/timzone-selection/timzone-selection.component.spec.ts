import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimzoneSelectionComponent } from './timzone-selection.component';

describe('TimzoneSelectionComponent', () => {
  let component: TimzoneSelectionComponent;
  let fixture: ComponentFixture<TimzoneSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TimzoneSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TimzoneSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
