import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveDefinitionFormComponent } from './archive-definition-form.component';

describe('ArchiveDefinitionFormComponent', () => {
  let component: ArchiveDefinitionFormComponent;
  let fixture: ComponentFixture<ArchiveDefinitionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArchiveDefinitionFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchiveDefinitionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
