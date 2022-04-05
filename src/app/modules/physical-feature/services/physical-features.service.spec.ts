import { TestBed } from '@angular/core/testing';

import { PhysicalFeaturesService } from './physical-features.service';

describe('PhysicalFeaturesService', () => {
  let service: PhysicalFeaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysicalFeaturesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
