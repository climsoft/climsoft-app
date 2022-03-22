import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualifiersComponent } from './qualifiers.component';

describe('QualifiersComponent', () => {
  let component: QualifiersComponent;
  let fixture: ComponentFixture<QualifiersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QualifiersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QualifiersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
