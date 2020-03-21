import { TestBed } from '@angular/core/testing';

import { XmPublicUiConfigService } from './xm-public-ui-config.service';

describe('XmPublicUiConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: XmPublicUiConfigService = TestBed.get(XmPublicUiConfigService);
    expect(service).toBeTruthy();
  });
});
