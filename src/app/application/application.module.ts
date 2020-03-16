import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { XmDashboardModule } from '@xm-ngx/dynamic';
import { TagInputModule } from 'ngx-chips';

import { RatingModule } from '../modules/components/xm-rating';
import { XmSharedModule } from '../shared/shared.module';
import { XmBalanceModule } from '../xm-balance/xm-balance.module';
import { XmEntityModule } from '../xm-entity/xm-entity.module';
import { ApplicationComponent } from './application.component';
import { ApplicationResolvePagingParams, applicationRoute } from './application.route';
import { EntityDetailComponent } from './entity-detail.component';

@NgModule({
    imports: [
        XmSharedModule,
        RouterModule.forChild(applicationRoute),
        TagInputModule,
        RatingModule,
        XmDashboardModule,
        XmEntityModule,
        XmBalanceModule,
    ],
    declarations: [
        ApplicationComponent,
        EntityDetailComponent,
    ],
    entryComponents: [
        ApplicationComponent,
    ],
    providers: [
        ApplicationResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ApplicationModule {
}
