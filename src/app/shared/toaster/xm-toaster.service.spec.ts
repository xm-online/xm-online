import { TestBed } from '@angular/core/testing';

import { XmToasterService } from './xm-toaster.service';

describe('XmToasterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XmToasterService = TestBed.get(XmToasterService);
    expect(service).toBeTruthy();
  });
});
