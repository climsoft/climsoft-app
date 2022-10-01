import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroFormGroupComponent } from './agro-form-group.component';

describe('AgroFormGroupComponent', () => {
  let component: AgroFormGroupComponent;
  let fixture: ComponentFixture<AgroFormGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgroFormGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
