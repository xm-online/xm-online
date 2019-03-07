import { Component, DebugElement, NO_ERRORS_SCHEMA, TemplateRef, ViewContainerRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { JhiLanguageHelper } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { PermitDirective } from '../../shared/privilege/privilege.directive';

class Mock {
    authenticationState = new Subject<any>();

    hasPrivileges(): Promise<any> {
        return Promise.resolve('value');
    }

    getAuthenticationState(): Observable<any> {
        this.authenticationState.next(true);
        return this.authenticationState.asObservable();
    }
}

function getTextContent(elements: DebugElement[]): string {
    return elements.map(element => element.nativeElement.textContent)
        .join('');
}

@Component({
    template: `<div>
        <button *permitted="'TEST'">test</button>
    </div>`
})
class TestDuplicateComponent {
    private authenticationState = new Subject<any>();
}

describe('Directive: PermitDirective', () => {
    let component: TestDuplicateComponent;
    let fixture: ComponentFixture<TestDuplicateComponent>;
    let templateRef: TemplateRef<any>;
    let viewContainerRef: ViewContainerRef;

    function getDebugElement(): DebugElement {
        return fixture.debugElement;
    }

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PermitDirective,
                TestDuplicateComponent
            ],
            providers: [
                JhiEventManager,
                ViewContainerRef,
                {
                    provide: JhiLanguageHelper,
                    useClass: Mock
                },
                {
                    provide: JhiLanguageService,
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
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(TestDuplicateComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    afterEach(() => {
        fixture.detectChanges();
        fixture = null;
    });

    it('Should`t create duplicates', async(() => {
        const buttons = getDebugElement().queryAll(By.css('button'));
        expect(getTextContent(buttons)).toEqual('test');
    }));
});
