import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { JhiAlertService, JhiConfigService, JhiDateUtils, JhiEventManager, JhiModuleConfig } from 'ng-jhipster';
import { FormsModule } from '@angular/forms';
import { MatInputModule, MatSelectModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { AccountService } from '../../shared';
import { Principal } from '../../shared/auth/principal.service';
import { EntityDetailDialogComponent } from './entity-detail-dialog.component';
import { I18nNamePipe } from '../../shared/language/i18n-name.pipe';
import { I18nJsfPipe } from '../../shared/language/i18n-jsf.pipe';
import { XmEntityService } from '..';

import { NgxWebstorageModule } from 'ngx-webstorage';

describe('Entity detail dialog Component', () => {
    let component: EntityDetailDialogComponent;
    let fixture: ComponentFixture<EntityDetailDialogComponent>;
    let element: DebugElement;
    let error: DebugElement;
    const PATTERN = '^(?=.*[a-z])[a-z0-9]{2,20}$';
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                MatSelectModule,
                NoopAnimationsModule,
                MatInputModule,
                NgxWebstorageModule.forRoot(),
                TranslateModule.forRoot()
            ],
            declarations: [
                EntityDetailDialogComponent,
                I18nNamePipe,
                I18nJsfPipe
            ],
            providers: [
                NgbActiveModal,
                XmEntityService,
                I18nJsfPipe,
                I18nNamePipe,
                HttpClient,
                HttpHandler,
                JhiDateUtils,
                JhiEventManager,
                Principal,
                AccountService,
                JhiAlertService,
                {
                    provide: JhiConfigService,
                    useValue: new JhiConfigService({defaultI18nLang: 'en', i18nEnabled: true})
                },
                JhiModuleConfig,
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(EntityDetailDialogComponent);
        component = fixture.debugElement.componentInstance;
        component.isEdit = false;
        error = fixture.debugElement.query(By.css('.has-error'));
    }));

    it('Should create component', async(() => {
        expect(component).toBeTruthy();
    }));

    it('Name input should be empty', async(() => {
        fixture.detectChanges();
        fixture.whenRenderingDone().then(data => {
            element = fixture.debugElement.query(By.css('#field_name'));
            expect(element.nativeElement.value).toBe('');
        });
    }));

    it('Should be no errors when no pattern', async(() => {
        component.nameValidPattern = null;
        fixture.detectChanges();
        component.xmEntity.name = '@e';
        fixture.detectChanges();
        expect(error).toBeFalsy();
    }));

    it('Should have error class when input value dose`t match pattern', fakeAsync(() => {
        component.nameValidPattern = PATTERN;
        fixture.detectChanges();
        component.xmEntity.name = '@w';
        for (let i = 0; i < 100; i++) {tick(1)};
        fixture.detectChanges();
        element = fixture.debugElement.query(By.css('#field_name'));
        const classArr = element.nativeElement.classList;
        let result;
        for (let i = 0; i < classArr.length; i++) {
            if (classArr[i] === 'ng-invalid') {
                result = true
            } else {
                result = false;
            }
        }
        expect(result).toBeTruthy();
    }));
});

