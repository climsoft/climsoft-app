import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynopticFormGroupComponent } from './synoptic-form-group.component';

describe('SynopticFormGroupComponent', () => {
  let component: SynopticFormGroupComponent;
  let fixture: ComponentFixture<SynopticFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SynopticFormGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SynopticFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
