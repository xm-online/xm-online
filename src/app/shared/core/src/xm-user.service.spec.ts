import { TestBed } from '@angular/core/testing';

import { XmUserService } from './xm-user.service';

describe('XmUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XmUserService = TestBed.get(XmUserService);
    expect(service).toBeTruthy();
  });
});
