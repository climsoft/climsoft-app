import { TestBed } from '@angular/core/testing';

import { QualifierService } from './qualifier.service';

describe('QualifierService', () => {
  let service: QualifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QualifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
