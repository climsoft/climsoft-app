import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveDefinitionsComponent } from './archive-definitions.component';

describe('ArchiveDefinitionsComponent', () => {
  let component: ArchiveDefinitionsComponent;
  let fixture: ComponentFixture<ArchiveDefinitionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveDefinitionsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveDefinitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
