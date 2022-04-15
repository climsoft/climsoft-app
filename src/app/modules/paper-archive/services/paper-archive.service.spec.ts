import { TestBed } from '@angular/core/testing';

import { PaperArchiveService } from './paper-archive.service';

describe('PaperArchiveService', () => {
  let service: PaperArchiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaperArchiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
