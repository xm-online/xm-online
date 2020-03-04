import { TestBed } from '@angular/core/testing';

import { XmAlertIntlService } from './xm-alert-intl.service';

describe('XmAlertIntlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XmAlertIntlService = TestBed.get(XmAlertIntlService);
    expect(service).toBeTruthy();
  });
});
