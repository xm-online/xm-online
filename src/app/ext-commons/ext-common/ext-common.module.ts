import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientJsonpModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';

import { AuthInterceptor } from '../../blocks/interceptor/auth.interceptor';
import { JhiLanguageHelper } from '../../shared';
import { ModulesLanguageHelper } from '../../shared/language/modules-language.helper';
import { XmSharedModule } from '../../shared/shared.module';
import {
    ClockWidgetComponent,
    ExchangeWidgetComponent,
    FeedService,
    FinanceService,
    IframeWidgetComponent,
    MdWidgetComponent,
    NewsWidgetComponent,
    SignInUpWidgetComponent,
    TwitterTimelineService,
    TwitterTimelineWidgetComponent,
    WeatherService,
    WeatherWidgetComponent,
    WelcomeWidgetComponent
} from './';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
        HttpClientJsonpModule
    ],
    declarations: [
        ClockWidgetComponent,
        ExchangeWidgetComponent,
        IframeWidgetComponent,
        MdWidgetComponent,
        NewsWidgetComponent,
        SignInUpWidgetComponent,
        TwitterTimelineWidgetComponent,
        WeatherWidgetComponent,
        WelcomeWidgetComponent
    ],
    entryComponents: [
        ClockWidgetComponent,
        ExchangeWidgetComponent,
        IframeWidgetComponent,
        MdWidgetComponent,
        NewsWidgetComponent,
        SignInUpWidgetComponent,
        TwitterTimelineWidgetComponent,
        WeatherWidgetComponent,
        WelcomeWidgetComponent
    ],
    providers: [
        FeedService,
        FinanceService,
        TwitterTimelineService,
        WeatherService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
            deps: [
                LocalStorageService,
                SessionStorageService
            ]
        },
        {provide: 'xm-widget-clock', useValue: ClockWidgetComponent},
        {provide: 'xm-widget-exchange-calculator', useValue: ExchangeWidgetComponent},
        {provide: 'xm-widget-iframe', useValue: IframeWidgetComponent},
        {provide: 'xm-widget-md', useValue: MdWidgetComponent},
        {provide: 'xm-widget-news', useValue: NewsWidgetComponent},
        {provide: 'xm-widget-sign-in-up', useValue: SignInUpWidgetComponent},
        {provide: 'xm-widget-twitter-timeline', useValue: TwitterTimelineWidgetComponent},
        {provide: 'xm-widget-weather', useValue: WeatherWidgetComponent},
        {provide: 'xm-widget-welcome', useValue: WelcomeWidgetComponent}
    ]
})
export class ExtCommonModule {
    constructor(private modulesLangHelper: ModulesLanguageHelper, private languageHelper: JhiLanguageHelper) {
        this.languageHelper.language.subscribe((languageKey: string) => {this.modulesLangHelper.correctLang(languageKey)});
    }
}

