import { TestBed } from '@angular/core/testing';

import { UiConfigService } from './ui-config.service';

describe('UiConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UiConfigService = TestBed.get(UiConfigService);
    expect(service).toBeTruthy();
  });
});
