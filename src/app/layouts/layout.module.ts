import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmPasswordNeededModule } from '@xm-ngx/components/xm-password-needed';
import { XmEntityModule } from '@xm-ngx/entity';
import { XmSharedModule } from '@xm-ngx/shared';
import { XmSidebarModule } from '../modules/xm-sidebar';
import { XmMaintenanceViewModule } from '../shared/components/maintenance/xm-maintenance-view.module';
import { InputModule } from '../shared/directives/input.module';
import { LanguageModule } from '../shared/language/language.module';
import { XmBalanceModule } from '../xm-balance/xm-balance.module';
import { XmNotificationsModule } from '../xm-notifications/xm-notifications.module';
import { XmTimelineModule } from '../xm-timeline/xm-timeline.module';
import { ErrorComponent } from './error/error.component';
import { FooterComponent } from './footer/footer.component';
import { XmMainComponent } from './main/main.component';
import { FeedbackDialogComponent } from './navbar/feedback/feedback-dialog/feedback-dialog.component';
import { FeedbackComponent } from './navbar/feedback/feedback.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PageRibbonComponent } from './profiles/page-ribbon.component';
import { XmRibbonModule } from "../modules/xm-ribbon/xm-ribbon.module";

@NgModule({
    imports: [
        XmPasswordNeededModule,
        LanguageModule,
        LoaderModule,
        InputModule,
        XmBalanceModule,
        XmMaintenanceViewModule,
        XmEntityModule,
        XmSharedModule,
        XmTimelineModule,
        XmNotificationsModule,
        RouterModule,
        XmSidebarModule,
        XmRibbonModule,
    ],
    exports: [XmMainComponent],
    declarations: [
        XmMainComponent,
        NavbarComponent,
        ErrorComponent,
        PageRibbonComponent,
        FooterComponent,
        FeedbackComponent,
        FeedbackDialogComponent,
    ],
    entryComponents: [
        NavbarComponent,
        XmMainComponent,
        FeedbackDialogComponent,
    ],
    providers: [],
})
export class LayoutModule {
}
