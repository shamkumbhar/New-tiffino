import { TestBed } from '@angular/core/testing';

import { LoyalityService } from './loyality.service';

describe('LoyalityService', () => {
  let service: LoyalityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoyalityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
