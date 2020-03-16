import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { XmAlertService } from './xm-alert.service';

describe('XmAlertService', () => {
    beforeEach(() => TestBed.configureTestingModule({imports: [XmSharedTestingModule, HttpClientTestingModule]}));

    it('should be created', () => {
        const service: XmAlertService = TestBed.get(XmAlertService);
        expect(service).toBeTruthy();
    });
});
