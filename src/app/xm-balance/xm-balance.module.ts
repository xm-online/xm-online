import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmSharedModule } from '@xm-ngx/shared';
import { NoDataModule } from '@xm-ngx/components/no-data';

import { BalanceDetailDialogComponent } from './balance-detail-dialog/balance-detail-dialog.component';
import { BalanceDetailComponent } from './balance-detail/balance-detail.component';
import { BalanceListCardComponent } from './balance-list-card/balance-list-card.component';
import { BalanceSpecWrapperService } from './shared/balance-spec-wrapper.service';
import { BalanceSpecService } from './shared/balance-spec.service';
import { BalanceService } from './shared/balance.service';
import { MetricService } from './shared/metric.service';
import { PocketService } from './shared/pocket.service';

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
