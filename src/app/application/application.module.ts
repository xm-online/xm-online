import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
    MaterialDesignFramework,
    MaterialDesignFrameworkModule,
    Framework,
    FrameworkLibraryService,
    JsonSchemaFormModule, JsonSchemaFormService,
    WidgetLibraryService
} from 'angular2-json-schema-form';
import { TagInputModule } from 'ngx-chips';
import { RatingModule } from 'ngx-rating';

import { XmSharedModule } from '../shared/shared.module';
import { XmBalanceModule } from '../xm-balance/xm-balance.module';
import { XmDashboardModule } from '../xm-dashboard/xm-dashboard.module';
import { XmEntityModule } from '../xm-entity/xm-entity.module';
import { ApplicationComponent } from './application.component';
import { ApplicationResolvePagingParams, applicationRoute } from './application.route';
import { EntityDetailComponent } from './entity-detail.component';

@NgModule({
    imports: [
        XmSharedModule,
        RouterModule.forChild(applicationRoute),
        TagInputModule,
        MaterialDesignFrameworkModule,
        {
            ngModule: JsonSchemaFormModule,
            providers: [
                JsonSchemaFormService,
                FrameworkLibraryService,
                WidgetLibraryService,
                {provide: Framework, useClass: MaterialDesignFramework, multi: true}
            ]
        },
        RatingModule,
        XmDashboardModule,
        XmEntityModule,
        XmBalanceModule
    ],
    declarations: [
        ApplicationComponent,
        EntityDetailComponent
    ],
    entryComponents: [
        ApplicationComponent
    ],
    providers: [
        ApplicationResolvePagingParams
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ApplicationModule {
}
