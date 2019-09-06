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
    styleUrls: ['./balance-list-card.component.scss']
})
export class BalanceListCardComponent implements OnInit {

    @Input() xmEntityId: number;
    @Input() typeKey: string;

    @ViewChildren('balanceSections') balanceSections: QueryList<any>;

    balances: Balance[];
    spec: Spec;

    protected static buildBalancePie(balance: Balance) {
        const max = balance.metrics.filter((m) => m.typeKey === 'MAX').shift();
        const total = max && max.value ? parseFloat(max.value) : balance.amount + 1;
        const options = {
            donut: true,
            donutWidth: 8,
            startAngle: 0,
            total: total,
            showLabel: false
        };
        return new Chartist.Pie('#balance-pie-' + balance.id, {
            series: [{
                value: total ? total : 0,
                className: 'ct-series-f'
            }, {
                value: balance.amount ? balance.amount : 0,
                className: 'ct-series-e'
            }, {
                value: balance.reserved ? balance.reserved : 0,
                className: 'ct-series-d'
            }]
        }, options);
    }

    constructor(protected balanceService: BalanceService,
                protected balanceSpecWrapperService: BalanceSpecWrapperService,
                protected metricService: MetricService,
                protected modalService: NgbModal,
                protected principal: Principal) {
    }

    ngOnInit() {
        this.load();
    }

    protected load() {
        this.balanceSpecWrapperService.spec().then((s) => {
            this.spec = s;
            if (s.types && s.types.filter((t) => t.entityTypeKey && t.entityTypeKey.includes(this.typeKey)).length) {
                this.balanceService.query({'entityId.in': this.xmEntityId}).subscribe((balances: HttpResponse<Balance[]>) => {
                    this.balances = balances.body;
                    this.balances.forEach((balance) => {
                        this.metricService.query({'balanceId.in': balance.id}).subscribe((metrics: HttpResponse<Metric[]>) => {
                            balance.metrics = metrics.body.filter((m) => m.balanceId === balance.id);
                            BalanceListCardComponent.buildBalancePie(balance);
                        });
                    })
                });
            }
        });
    }

    getMeasureSpec(balance: Balance): any {
        const balanceSpec = this.spec.types.filter((t) => t.key === balance.typeKey).shift();
        return this.spec.measures.filter((m) => m.key === balanceSpec.measureKey).shift();
    }

    getBalanceSpec(balance: Balance): any {
        return this.spec.types.filter((t) => t.key === balance.typeKey).shift();
    }

    onClickDetail(balanceId: number) {
        const modalRef = this.modalService.open(BalanceDetailDialogComponent, {backdrop: 'static'});
        modalRef.componentInstance.balanceId = balanceId;
        return modalRef;
    }

}
