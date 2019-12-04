import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { JhiEventManager } from 'ng-jhipster';
import { MarkdownModule } from 'ngx-markdown';
import { LocalStorageService, NgxWebstorageModule, SessionStorageService } from 'ngx-webstorage';
import { PaginationConfig } from './blocks/config/uib-pagination.config';
import { AuthExpiredInterceptor } from './blocks/interceptor/auth-expired.interceptor';
import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';
import { ErrorHandlerInterceptor } from './blocks/interceptor/errorhandler.interceptor';
import { ProfileService, XmMainComponent } from './layouts';
import { LayoutModule } from './layouts/layout.module';
import { JhiLanguageHelper, ModulesLanguageHelper, UserRouteAccessService } from './shared';
import { XmSharedModule } from './shared/shared.module';
import { XmApplicationConfigService } from './shared/spec/xm-config.service';
import { XmDashboardModule } from './xm-dashboard/xm-dashboard.module';
import { XmRoutingModule } from './xm-routing.module';

export function appInitializerFn(appConfig: XmApplicationConfigService): () => Promise<any> {
    // tslint:disable-next-line:only-arrow-functions
    const r = function(): Promise<void> {
        return appConfig.loadAppConfig();
    };
    return r;
}

export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
    return new TranslateHttpLoader(http, './i18n/', '.json');
}

@NgModule({
    imports: [
        BrowserModule,
        HttpClientModule,
        XmRoutingModule,
        NgxWebstorageModule.forRoot({prefix: 'jhi', separator: '-'}),
        XmSharedModule.forRoot(),
        BrowserAnimationsModule,
        XmDashboardModule.forRoot(),
        TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient],
                },
            },
        ),
        LayoutModule,
        MarkdownModule.forRoot(),
    ],
    providers: [
        XmApplicationConfigService,
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializerFn,
            multi: true,
            deps: [XmApplicationConfigService],
        },
        ProfileService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
            deps: [
                LocalStorageService,
                SessionStorageService,
            ],
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthExpiredInterceptor,
            multi: true,
            deps: [
                Injector,
            ],
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorHandlerInterceptor,
            multi: true,
            deps: [
                JhiEventManager,
            ],
        },
        PaginationConfig,
        UserRouteAccessService,
    ],
    bootstrap: [XmMainComponent],
})
export class XmModule {
    constructor(private modulesLangHelper: ModulesLanguageHelper, private languageHelper: JhiLanguageHelper) {
        this.languageHelper
            .language
            .subscribe((languageKey: string) => {this.modulesLangHelper.correctLang(languageKey); });
    }
}
