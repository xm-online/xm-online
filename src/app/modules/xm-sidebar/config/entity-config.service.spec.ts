import { TestBed } from '@angular/core/testing';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { EntityConfigService } from './entity-config.service';

describe('EntityConfigService', () => {
    beforeEach(() => TestBed.configureTestingModule({imports: [XmSharedTestingModule]}));

    it('should be created', () => {
        const service: EntityConfigService = TestBed.get(EntityConfigService);
        expect(service).toBeTruthy();
    });
});
