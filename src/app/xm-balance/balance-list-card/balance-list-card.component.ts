import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as Chartist from 'chartist';

import { Spec } from '..';
import { Principal } from '../../shared/auth/principal.service';
import { BalanceDetailDialogComponent } from '../balance-detail-dialog/balance-detail-dialog.component';
import { BalanceSpecWrapperService } from '../shared/balance-spec-wrapper.service';
import { Balance } from '../shared/balance.model';
import { BalanceService } from '../shared/balance.service';
import { Metric } from '../shared/metric.model';
import { MetricService } from '../shared/metric.service';

@Component({
    selector: 'xm-balance-list-card',
    templateUrl: './balance-list-card.component.html',
    styleUrls: ['./balance-list-card.component.scss'],
})
export class BalanceListCardComponent implements OnInit {

    protected static buildBalancePie(balance: Balance): Chartist.IChartistPieChart {
        const max = balance.metrics.filter((m) => m.typeKey === 'MAX').shift();
        const total = max && max.value ? parseFloat(max.value) : balance.amount + 1;
        const options = {
            donut: true,
            donutWidth: 8,
            startAngle: 0,
            total,
            showLabel: false,
        };
        return new Chartist.Pie('#balance-pie-' + balance.id, {
            series: [{
                value: total ? total : 0,
                className: 'ct-series-f',
            }, {
                value: balance.amount ? balance.amount : 0,
                className: 'ct-series-e',
            }, {
                value: balance.reserved ? balance.reserved : 0,
                className: 'ct-series-d',
            }],
        }, options);
    }

    @Input() public xmEntityId: number;
    @Input() public typeKey: string;
    @ViewChildren('balanceSections') public balanceSections: QueryList<any>;
    public balances: Balance[];
    public spec: Spec;

    constructor(protected balanceService: BalanceService,
                protected balanceSpecWrapperService: BalanceSpecWrapperService,
                protected metricService: MetricService,
                protected modalService: NgbModal,
                public principal: Principal) {
    }

    public ngOnInit(): void {
        this.load();
    }

    public getMeasureSpec(balance: Balance): any {
        const balanceSpec = this.spec.types.filter((t) => t.key === balance.typeKey).shift();
        return this.spec.measures.filter((m) => m.key === balanceSpec.measureKey).shift();
    }

    public getBalanceSpec(balance: Balance): any {
        return this.spec.types.filter((t) => t.key === balance.typeKey).shift();
    }

    public onClickDetail(balanceId: number): void {
        const modalRef = this.modalService.open(BalanceDetailDialogComponent, {backdrop: 'static'});
        modalRef.componentInstance.balanceId = balanceId;
    }

    protected load(): void {
        this.balanceSpecWrapperService.spec().then((s) => {
            this.spec = s;
            if (s.types && s.types.filter((t) => t.entityTypeKey && t.entityTypeKey.includes(this.typeKey)).length) {
                this.balanceService.query({'entityId.in': this.xmEntityId})
                    .subscribe((balances: HttpResponse<Balance[]>) => {
                        this.balances = balances.body;
                        this.balances.forEach((balance) => {
                            this.metricService.query({'balanceId.in': balance.id})
                                .subscribe((metrics: HttpResponse<Metric[]>) => {
                                    balance.metrics = metrics.body.filter((m) => m.balanceId === balance.id);
                                    BalanceListCardComponent.buildBalancePie(balance);
                                });
                        });
                    });
            }
        });
    }

}
