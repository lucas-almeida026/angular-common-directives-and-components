import { TestBed } from '@angular/core/testing';

import { AcdncService } from './acdnc.service';

describe('AcdncService', () => {
  let service: AcdncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AcdncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
