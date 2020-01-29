import { TestBed } from '@angular/core/testing';

import { EntityConfigService } from './entity-config.service';

describe('EntityConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EntityConfigService = TestBed.get(EntityConfigService);
    expect(service).toBeTruthy();
  });
});
