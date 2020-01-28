import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XmSidebarModule } from '../modules/xm-sidebar';
import { XmSharedModule } from '../shared/shared.module';
import { XmBalanceModule } from '../xm-balance/xm-balance.module';
import { XmEntityModule } from '../xm-entity/xm-entity.module';
import { XmNotificationsModule } from '../xm-notifications/xm-notifications.module';
import { XmTimelineModule } from '../xm-timeline/xm-timeline.module';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './footer/footer.component';
import { XmMainComponent } from './main/main.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageRibbonComponent } from './profiles/page-ribbon.component';

@NgModule({
    imports: [
        XmBalanceModule,
        XmEntityModule,
        XmSharedModule,
        XmTimelineModule,
        XmNotificationsModule,
        RouterModule,
        XmSidebarModule,
    ],
    exports: [XmMainComponent, XmSharedModule],
    declarations: [
        XmMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        FooterComponent,
    ],
    entryComponents: [
        NavbarComponent,
        XmMainComponent,
    ],
    providers: [],
})
export class LayoutModule {
}
