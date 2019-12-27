import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { XmSharedModule } from '../shared/shared.module';
import { NotificationsComponent } from './notifications/notifications.component';
import { NotificationsService } from './shared/notifications.service';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
    ],
    declarations: [
        NotificationsComponent,
    ],
    exports: [
        NotificationsComponent,
    ],
    providers: [
        NotificationsService,
    ],
})
export class XmNotificationsModule {
}
