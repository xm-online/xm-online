import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { JhiLanguageHelper, LoginService, ModulesLanguageHelper, XmConfigService } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { XmApplicationConfigService } from '../../shared/spec/xm-config.service';
import { XmMainComponent } from './main.component';


class Mock {
}

class MockedConfig extends Mock {
    isResolved(): Observable<Boolean> {
        return of(true);
    }
    isMaintenanceProgress(): Observable<Boolean> {
        return of(true);
    }
}

describe('XmMainComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                XmMainComponent
            ],
            imports: [
                NgxWebstorageModule.forRoot(),
            ],
            providers: [
                JhiEventManager,
                {
                    provide: JhiLanguageHelper,
                    useClass: Mock
                },
                {
                    provide: ModulesLanguageHelper,
                    useClass: Mock
                },
                {
                    provide: JhiLanguageService,
                    useClass: Mock
                },
                {
                    provide: TranslateService,
                    useClass: Mock
                },
                {
                    provide: Router,
                    useClass: Mock
                },
                {
                    provide: Principal,
                    useClass: Mock
                },
                {
                    provide: ModulesLanguageHelper,
                    useClass: Mock
                },
                {
                    provide: XmApplicationConfigService,
                    useClass: MockedConfig
                },
                {
                    provide: XmConfigService,
                    useClass: MockedConfig
                },
                {
                    provide: LoginService,
                    useClass: Mock
                }
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(XmMainComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
