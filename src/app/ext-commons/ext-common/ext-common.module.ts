import { CommonModule } from '@angular/common';
import { HttpClientJsonpModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
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
    WelcomeWidgetComponent,
} from './';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
        HttpClientJsonpModule,
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
        WelcomeWidgetComponent,
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
        WelcomeWidgetComponent,
    ],
    providers: [
        FeedService,
        FinanceService,
        TwitterTimelineService,
        WeatherService,
        {provide: 'xm-widget-clock', useValue: ClockWidgetComponent},
        {provide: 'xm-widget-exchange-calculator', useValue: ExchangeWidgetComponent},
        {provide: 'xm-widget-iframe', useValue: IframeWidgetComponent},
        {provide: 'xm-widget-md', useValue: MdWidgetComponent},
        {provide: 'xm-widget-news', useValue: NewsWidgetComponent},
        {provide: 'xm-widget-sign-in-up', useValue: SignInUpWidgetComponent},
        {provide: 'xm-widget-twitter-timeline', useValue: TwitterTimelineWidgetComponent},
        {provide: 'xm-widget-weather', useValue: WeatherWidgetComponent},
        {provide: 'xm-widget-welcome', useValue: WelcomeWidgetComponent},
    ],
})
export class ExtCommonModule {
}
