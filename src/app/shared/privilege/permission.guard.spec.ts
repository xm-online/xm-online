import { inject, TestBed } from '@angular/core/testing';

import { PermissionGuard } from './permission.guard';

describe('PermissionGuard', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [PermissionGuard],
        });
    });

    it('should ...', inject([PermissionGuard], (guard: PermissionGuard) => {
        expect(guard).toBeTruthy();
    }));
});
