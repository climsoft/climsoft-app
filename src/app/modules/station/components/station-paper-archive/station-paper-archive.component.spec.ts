import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StationPaperArchiveComponent } from './station-paper-archive.component';

describe('StationPaperArchiveComponent', () => {
  let component: StationPaperArchiveComponent;
  let fixture: ComponentFixture<StationPaperArchiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StationPaperArchiveComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StationPaperArchiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
