import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, NO_ERRORS_SCHEMA, TemplateRef, ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { XmEventManager } from '@xm-ngx/core';
import { XmSharedTestingModule } from '@xm-ngx/shared';
import { JhiLanguageService } from 'ng-jhipster';
import { Subject } from 'rxjs/Subject';

import { JhiLanguageHelper } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { XmPrivilegeDirective } from './xmPrivilege.directive';

class Mock {
}

// tslint:disable-next-line:max-classes-per-file
@Component({
    template: `
        <div>
            <button class="noPermission">noPermission</button>
            <button class="privOk" *xmPermitted="['TEST_OK']">privOk</button>
            <button class="privNok" *xmPermitted="['TEST_NOK']">privNok</button>
            <button class="privOkCtxOk" *xmPermitted="['TEST_OK']; context:contextCB(true)">privOkCtxOk</button>
            <button class="privOkCtxNok" *xmPermitted="['TEST_OK']; context:contextCB(false)">privOkCtxNok</button>
            <button class="privNokCtxOk" *xmPermitted="['TEST_NOK']; context:contextCB(true)">privNokCtxOk</button>
            <button class="privNokCtxNok" *xmPermitted="['TEST_NOK']; context:contextCB(false)">privNokCtxNok</button>
        </div>`,
})
class TestComponent {
    public contextCB(value: boolean): any {
        return () => value;
    }
}

describe('Directive: PermitDirective', () => {

    let fixture: ComponentFixture<TestComponent>;

    let mockPrincipalService;

    let authenticationState;

    const OK_SET = new Set(['noPermission', 'privOk', 'privOkCtxOk']);
    const NOK_SET = new Set(['privNok', 'privOkCtxNok', 'privNokCtxOk', 'privNokCtxNok']);

    const OK_PRIV = 'TEST_OK';
    const NOK_PRIV = 'TEST_NOK';

    const permissionResolver = (privileges: string[] = [], privilegesOperation: string = 'OR') => {
        if (!privileges) {
            console.info('No privileges passed');
            return Promise.resolve(false);
        }

        if (privileges.length === 1 && OK_PRIV === privileges[0]) {
            return Promise.resolve(true);
        }

        if (privileges.length === 1 && NOK_PRIV === privileges[0]) {
            return Promise.resolve(false);
        }

        console.info('Resolve false, no match');
        return Promise.resolve(false);
    };

    beforeEach(async(() => {

        mockPrincipalService = jasmine.createSpyObj(['getAuthenticationState', 'hasPrivileges']);

        mockPrincipalService.hasPrivileges.and.callFake(permissionResolver);

        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            imports: [XmSharedTestingModule, HttpClientTestingModule],
            declarations: [
                XmPrivilegeDirective,
                TestComponent,
            ],
            providers: [
                XmEventManager,
                ViewContainerRef,
                TemplateRef,
                {provide: JhiLanguageHelper, useClass: Mock},
                {provide: JhiLanguageService, useClass: Mock},
                {provide: Router, useClass: Mock},
                {provide: Principal, useValue: mockPrincipalService},
            ],
        });

        authenticationState = new Subject<any>();
        fixture = TestBed.createComponent(TestComponent);
    }));

    it('should be visible all elements from OK_SET', async(() => {
        authenticationState.next(true);
        mockPrincipalService.getAuthenticationState.and.returnValue(authenticationState.asObservable());

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const buttonComp = fixture.debugElement.queryAll(By.css('button'));
            for (const item of buttonComp) {
                expect(OK_SET.has(item.nativeElement.textContent)).toBe(true);

            }
        });

    }));

    it('should not be visible all elements from NOK_SET', async(() => {
        authenticationState.next(true);
        mockPrincipalService.getAuthenticationState.and.returnValue(authenticationState.asObservable());

        fixture.detectChanges();

        fixture.whenStable().then(() => {
            const buttonComp = fixture.debugElement.queryAll(By.css('button'));
            for (const item of buttonComp) {
                expect(NOK_SET.has(item.nativeElement.textContent)).toBe(false);

            }
        });

    }));

});
