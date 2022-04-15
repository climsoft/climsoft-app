import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperArchivesComponent } from './paper-archives.component';

describe('PaperArchivesComponent', () => {
  let component: PaperArchivesComponent;
  let fixture: ComponentFixture<PaperArchivesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaperArchivesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperArchivesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
