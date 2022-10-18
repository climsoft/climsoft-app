import { TestBed } from '@angular/core/testing';

import { ScheduleClassService } from './schedule-class.service';

describe('ScheduleClassService', () => {
  let service: ScheduleClassService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleClassService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
