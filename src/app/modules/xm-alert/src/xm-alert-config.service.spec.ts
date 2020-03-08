import { TestBed } from '@angular/core/testing';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { XmAlertConfigService } from './xm-alert-config.service';

describe('XmAlertConfigService', () => {
    beforeEach(() => TestBed.configureTestingModule({imports: [XmSharedTestingModule]}));

    it('should be created', () => {
        const service: XmAlertConfigService = TestBed.get(XmAlertConfigService);
        expect(service).toBeTruthy();
    });
});
