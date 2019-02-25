import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { XmSharedModule } from '../shared/shared.module';
import {
    BalanceDetailDialogComponent,
    BalanceDetailComponent,
    BalanceListCardComponent,
    BalanceService,
    BalanceSpecService,
    BalanceSpecWrapperService,
    MetricService,
    PocketService
} from './';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule
    ],
    declarations: [
        BalanceListCardComponent,
        BalanceDetailDialogComponent,
        BalanceDetailComponent
    ],
    entryComponents: [
        BalanceDetailDialogComponent,
        BalanceDetailComponent
    ],
    exports: [
        BalanceListCardComponent,
        BalanceDetailDialogComponent,
        BalanceDetailComponent
    ],
    providers: [
        BalanceService,
        BalanceSpecService,
        BalanceSpecWrapperService,
        MetricService,
        PocketService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class XmBalanceModule {
}
