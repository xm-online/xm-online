/* tslint:disable:max-classes-per-file */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { XmEventManager } from '@xm-ngx/core';
import { XmSharedTestingModule } from '@xm-ngx/shared';
import { JhiLanguageService } from 'ng-jhipster';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { Observable, of } from 'rxjs';

import { JhiLanguageHelper, LoginService, ModulesLanguageHelper, XmConfigService } from '../../shared';
import { Principal } from '@xm-ngx/core/auth';
import { XmApplicationConfigService } from '../../shared/spec/xm-config.service';
import { XmMainComponent } from './main.component';

class Mock {
}

class MockedConfig extends Mock {
    public isResolved(): Observable<boolean> {
        return of(true);
    }

    public isMaintenanceProgress(): Observable<boolean> {
        return of(true);
    }
}

describe('XmMainComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [XmSharedTestingModule, HttpClientTestingModule, NgxWebstorageModule.forRoot()],
            declarations: [
                XmMainComponent,
            ],
            providers: [
                XmEventManager,
                {
                    provide: JhiLanguageHelper,
                    useClass: Mock,
                },
                {
                    provide: ModulesLanguageHelper,
                    useClass: Mock,
                },
                {
                    provide: JhiLanguageService,
                    useClass: Mock,
                },
                {
                    provide: TranslateService,
                    useClass: Mock,
                },
                {
                    provide: Router,
                    useClass: Mock,
                },
                {
                    provide: Principal,
                    useClass: Mock,
                },
                {
                    provide: ModulesLanguageHelper,
                    useClass: Mock,
                },
                {
                    provide: XmApplicationConfigService,
                    useClass: MockedConfig,
                },
                {
                    provide: XmConfigService,
                    useClass: MockedConfig,
                },
                {
                    provide: LoginService,
                    useClass: Mock,
                },
            ],
        }).compileComponents();
    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(XmMainComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
});
