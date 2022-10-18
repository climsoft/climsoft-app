import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperArchiveFormComponent } from './paper-archive-form.component';

describe('PaperArchiveFormComponent', () => {
  let component: PaperArchiveFormComponent;
  let fixture: ComponentFixture<PaperArchiveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaperArchiveFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaperArchiveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
