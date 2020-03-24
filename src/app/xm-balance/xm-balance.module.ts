import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmSharedModule } from '@xm-ngx/shared';
import { NoDataModule } from '@xm-ngx/components/no-data';

import {
    BalanceDetailComponent,
    BalanceDetailDialogComponent,
    BalanceListCardComponent,
    BalanceService,
    BalanceSpecService,
    BalanceSpecWrapperService,
    MetricService,
    PocketService,
} from './';

@NgModule({
    imports: [
        CommonModule,
        NoDataModule,
        XmSharedModule,
    ],
    declarations: [
        BalanceListCardComponent,
        BalanceDetailDialogComponent,
        BalanceDetailComponent,
    ],
    entryComponents: [
        BalanceDetailDialogComponent,
        BalanceDetailComponent,
    ],
    exports: [
        BalanceListCardComponent,
        BalanceDetailDialogComponent,
        BalanceDetailComponent,
    ],
    providers: [
        BalanceService,
        BalanceSpecService,
        BalanceSpecWrapperService,
        MetricService,
        PocketService,
    ],
})
export class XmBalanceModule {
}
