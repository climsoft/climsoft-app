import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementSelectionComponent } from './element-selection.component';

describe('ElementSelectionComponent', () => {
  let component: ElementSelectionComponent;
  let fixture: ComponentFixture<ElementSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementSelectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
