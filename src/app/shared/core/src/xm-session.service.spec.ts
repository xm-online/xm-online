import { TestBed } from '@angular/core/testing';

import { XmSessionService } from './xm-session.service';

describe('XmSessionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XmSessionService = TestBed.get(XmSessionService);
    expect(service).toBeTruthy();
  });
});
