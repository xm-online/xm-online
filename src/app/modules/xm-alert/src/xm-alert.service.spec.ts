import { TestBed } from '@angular/core/testing';

import { XmAlertService } from './xm-alert.service';

describe('XmAlertService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XmAlertService = TestBed.get(XmAlertService);
    expect(service).toBeTruthy();
  });
});
