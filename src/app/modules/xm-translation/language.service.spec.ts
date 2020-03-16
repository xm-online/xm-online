import { TestBed } from '@angular/core/testing';
import { XmSharedTestingModule } from '@xm-ngx/shared';

import { LanguageService } from './language.service';

describe('LanguageService', () => {
    beforeEach(() => TestBed.configureTestingModule({imports: [XmSharedTestingModule]}));

    it('should be created', () => {
        const service: LanguageService = TestBed.get(LanguageService);
        expect(service).toBeTruthy();
    });
});
