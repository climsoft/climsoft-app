import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureClassesComponent } from './feature-classes.component';

describe('FeatureClassesComponent', () => {
  let component: FeatureClassesComponent;
  let fixture: ComponentFixture<FeatureClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureClassesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
