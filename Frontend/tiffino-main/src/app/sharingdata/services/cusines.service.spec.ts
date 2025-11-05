import { TestBed } from '@angular/core/testing';

import { CusinesService } from './cusines.service';

describe('CusinesService', () => {
  let service: CusinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CusinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
