import { TestBed } from '@angular/core/testing';

import { XmAlertConfigService } from './xm-alert-config.service';

describe('XmAlertConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XmAlertConfigService = TestBed.get(XmAlertConfigService);
    expect(service).toBeTruthy();
  });
});
