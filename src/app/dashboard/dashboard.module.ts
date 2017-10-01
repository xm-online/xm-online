import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {DashboardComponent} from "./dashboard.component";
import {DashboardsComponent} from "./dashboards.component";
import {DynamicWidget} from "./widgets/dynamic-widget.component";
import {
    XmWidgetWeatherService,
    XmWidgetExchangeService,
    XmWidgetLotsService,

    XmWidgetDefaultComponent,
    XmWidgetAvailableOfferingsComponent,
    XmWidgetGeneralMapComponent,
    XmWidgetStatsComponent,
    XmWidgetTasksComponent,
    XmWidgetWeatherComponent,
    XmWidgetClockComponent,
    XmWidgetGeneralCountriesComponent,
    XmWidgetMttEarthComponent,
    XmWidgetExchangeComponent,
    XmWidgetMdComponent,
    XmWidgetActiveCallsComponent,
    XmWidgetLotsComponent,
    XmWidgetLotsDetailComponent,
    XmWidgetCountdownComponent,
    XmWidgetWelcomeComponent,
    XmWidgetEntitiesListComponent,
} from './';
import {DashboardRoutes} from "./dashboard.routing";

import {NgbCarouselModule} from "@ng-bootstrap/ng-bootstrap";
import { MdTableComponent } from './widgets/xm-widget-general-countries/md/md-table/md-table.component';
import {ShareButtonsModule} from "ngx-sharebuttons";
import {GateSharedModule} from "../shared/shared.module";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(DashboardRoutes),
        FormsModule,
        GateSharedModule,
        JsonpModule,
        NgbCarouselModule,
        ShareButtonsModule.forRoot(),
    ],
    declarations: [
        MdTableComponent,
        DashboardsComponent,
        DashboardComponent,
        DynamicWidget,
        XmWidgetDefaultComponent,
        XmWidgetAvailableOfferingsComponent,
        XmWidgetGeneralMapComponent,
        XmWidgetStatsComponent,
        XmWidgetTasksComponent,
        XmWidgetClockComponent,
        XmWidgetWeatherComponent,
        XmWidgetGeneralCountriesComponent,
        XmWidgetMttEarthComponent,
        XmWidgetExchangeComponent,
        XmWidgetMdComponent,
        XmWidgetActiveCallsComponent,
        XmWidgetLotsComponent,
        XmWidgetLotsDetailComponent,
        XmWidgetCountdownComponent,
        XmWidgetWelcomeComponent,
        XmWidgetEntitiesListComponent,
    ],
    entryComponents: [
        XmWidgetLotsDetailComponent,
    ],
    providers: [
        XmWidgetWeatherService,
        XmWidgetExchangeService,
        XmWidgetLotsService,
    ],
    exports: [
        DynamicWidget,
        XmWidgetDefaultComponent,
        XmWidgetAvailableOfferingsComponent,
        XmWidgetGeneralMapComponent,
        XmWidgetStatsComponent,
        XmWidgetTasksComponent,
        XmWidgetClockComponent,
        XmWidgetWeatherComponent,
        XmWidgetGeneralCountriesComponent,
        XmWidgetMttEarthComponent,
        XmWidgetExchangeComponent,
        XmWidgetMdComponent,
        XmWidgetActiveCallsComponent,
        XmWidgetLotsComponent,
        XmWidgetLotsDetailComponent,
        XmWidgetCountdownComponent,
        XmWidgetWelcomeComponent,
        XmWidgetEntitiesListComponent,
    ],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class DashboardModule {}
