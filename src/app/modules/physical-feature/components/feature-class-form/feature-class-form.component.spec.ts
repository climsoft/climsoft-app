import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureClassFormComponent } from './feature-class-form.component';

describe('FeatureClassFormComponent', () => {
  let component: FeatureClassFormComponent;
  let fixture: ComponentFixture<FeatureClassFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeatureClassFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureClassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
