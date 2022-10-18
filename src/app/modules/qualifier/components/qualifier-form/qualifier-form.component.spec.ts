import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifierFormComponent } from './qualifier-form.component';

describe('QualifierFormComponent', () => {
  let component: QualifierFormComponent;
  let fixture: ComponentFixture<QualifierFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualifierFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifierFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
