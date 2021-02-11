import { TestBed } from '@angular/core/testing';

import { LdJsonService } from './ld-json.service';

describe('LdJsonService', () => {
  let service: LdJsonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LdJsonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
