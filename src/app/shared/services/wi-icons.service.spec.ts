import { TestBed } from '@angular/core/testing';

import { WiIconsService } from './wi-icons.service';

describe('WiIconsService', () => {
  let service: WiIconsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WiIconsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
