import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveDefinitionSelectionComponent } from './archive-definition-selection.component';

describe('ArchiveDefinitionSelectionComponent', () => {
  let component: ArchiveDefinitionSelectionComponent;
  let fixture: ComponentFixture<ArchiveDefinitionSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveDefinitionSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveDefinitionSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
