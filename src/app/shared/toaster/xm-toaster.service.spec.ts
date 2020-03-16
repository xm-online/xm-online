import { TestBed } from '@angular/core/testing';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { XmToasterService } from './xm-toaster.service';

describe('XmToasterService', () => {
    beforeEach(() => TestBed.configureTestingModule({imports: [XmSharedTestingModule]}));

    it('should be created', () => {
        const service: XmToasterService = TestBed.get(XmToasterService);
        expect(service).toBeTruthy();
    });
});
