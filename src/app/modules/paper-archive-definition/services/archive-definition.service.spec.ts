import { TestBed } from '@angular/core/testing';

import { ArchiveDefinitionService } from './archive-definition.service';

describe('ArchiveDefinitionService', () => {
  let service: ArchiveDefinitionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArchiveDefinitionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
