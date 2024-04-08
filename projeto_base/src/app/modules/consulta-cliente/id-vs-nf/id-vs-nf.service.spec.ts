import { TestBed } from '@angular/core/testing';

import { IdVsNfService } from './id-vs-nf.service';

describe('IdVsNfService', () => {
  let service: IdVsNfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdVsNfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
