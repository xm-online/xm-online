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
import { ErrorComponent, FooterComponent, NavbarComponent, PageRibbonComponent, ProfileService, XmMainComponent } from './layouts';
import { SidebarModule } from './layouts/sidebar/sidebar.module';
import { UserRouteAccessService } from './shared';
import { XmSharedModule } from './shared/shared.module';
import { XmApplicationConfigService } from './shared/spec/xm-config.service';
import { XmBalanceModule } from './xm-balance/xm-balance.module';
import { XmDashboardModule } from './xm-dashboard/xm-dashboard.module';
import { XmEntityModule } from './xm-entity/xm-entity.module';
import { XmNotificationsModule } from './xm-notifications/xm-notifications.module';
import { XmRoutingModule } from './xm-routing.module';
import { XmTimelineModule } from './xm-timeline/xm-timeline.module';

export function appInitializerFn(appConfig: XmApplicationConfigService): () => Promise<any> {
    const r = function () {
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
        XmRoutingModule,
        NgxWebstorageModule.forRoot({prefix: 'jhi', separator: '-'}),
        XmSharedModule.forRoot(),
        XmSharedModule,
        HttpClientModule,
        BrowserAnimationsModule,
        SidebarModule,
        XmBalanceModule,
        XmEntityModule,
        XmDashboardModule.forRoot(),
        XmTimelineModule,
        XmNotificationsModule,
        TranslateModule.forRoot({
                loader: {
                    provide: TranslateLoader,
                    useFactory: HttpLoaderFactory,
                    deps: [HttpClient],
                },
            },
        ),
        MarkdownModule.forRoot(),
    ],
    declarations: [
        XmMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        FooterComponent,
    ],
    entryComponents: [
        NavbarComponent,
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
}
