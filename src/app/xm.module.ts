import { AuthInterceptor } from './blocks/interceptor/auth.interceptor';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2Webstorage } from 'ng2-webstorage';

import { UserRouteAccessService } from './shared';
import {GateSharedModule} from "./shared/shared.module";
import { GateHomeModule } from './home/home.module';
import { GateAdminModule } from './admin/admin.module';
import { GateAccountModule } from './account/account.module';
import { GateEntityModule } from './entities/entity.module';
import { ApplicationModule } from './application/application.module';
import {LayoutRoutingModule} from "./layouts/layout-routing.module";

import { customHttpProvider } from './blocks/interceptor/http.provider';
import { PaginationConfig } from './blocks/config/uib-pagination.config';

import {
    XmMainComponent,
    NavbarComponent,
    FooterComponent,
    ProfileService,
    PageRibbonComponent,
    ErrorComponent
} from './layouts';
import { SidebarModule } from './layouts/sidebar/sidebar.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { Ng2BootstrapModule } from 'ngx-bootstrap';
import { SearchModule } from './search/search.module';

@NgModule({
    imports: [
        BrowserModule,
        LayoutRoutingModule,
        // Ng2BootstrapModule,
        Ng2Webstorage.forRoot({ prefix: 'jhi', separator: '-'}),
        GateSharedModule,
        GateHomeModule,
        GateAdminModule,
        GateAccountModule,
        GateEntityModule,
        ApplicationModule,
        SidebarModule,
        DashboardModule,
        SearchModule
    ],
    declarations: [
        XmMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        FooterComponent
    ],
    providers: [
        ProfileService,
        customHttpProvider(),
        PaginationConfig,
        UserRouteAccessService
    ],
    bootstrap: [ XmMainComponent ]
})
export class XmModule {}
