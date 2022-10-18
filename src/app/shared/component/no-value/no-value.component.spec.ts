import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoValueComponent } from './no-value.component';

describe('NoValueComponent', () => {
  let component: NoValueComponent;
  let fixture: ComponentFixture<NoValueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoValueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
