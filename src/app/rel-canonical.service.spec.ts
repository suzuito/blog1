import { TestBed } from '@angular/core/testing';

import { RelCanonicalService } from './rel-canonical.service';

describe('RelCanonicalService', () => {
  let service: RelCanonicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RelCanonicalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
