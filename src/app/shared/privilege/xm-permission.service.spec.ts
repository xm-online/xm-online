import { TestBed } from '@angular/core/testing';

import { XmPermissionService } from './xm-permission.service';

describe('XmPermissionService', () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () => {
        const service: XmPermissionService = TestBed.get(XmPermissionService);
        expect(service).toBeTruthy();
    });
});
