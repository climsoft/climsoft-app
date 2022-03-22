import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationElementDialogComponent } from './station-element-dialog.component';

describe('StationElementDialogComponent', () => {
  let component: StationElementDialogComponent;
  let fixture: ComponentFixture<StationElementDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationElementDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationElementDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
