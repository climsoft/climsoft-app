import { TestBed } from '@angular/core/testing';

import { LocHistoryService } from './loc-history.service';

describe('LocHistoryService', () => {
  let service: LocHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
