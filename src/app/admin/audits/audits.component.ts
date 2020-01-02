import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { JhiOrderByPipe, JhiParseLinks } from 'ng-jhipster';

import { ITEMS_PER_PAGE } from '../../shared';
import { Link } from '../../xm-entity';
import { Audit } from './audit.model';
import { AuditsService } from './audits.service';

declare let moment: any;

@Component({
    selector: 'xm-audit',
    templateUrl: './audits.component.html',
    providers: [JhiOrderByPipe],
})
export class AuditsComponent implements OnInit {
    public audits: Audit[];
    public fromDate: string;
    public itemsPerPage: any;
    public links: Link[];
    public page: number;
    public orderProp: string;
    public reverse: boolean;
    public toDate: string;
    public totalItems: number;
    public showLoader: boolean;

    constructor(
        private auditsService: AuditsService,
        private parseLinks: JhiParseLinks,
        private orderByPipe: JhiOrderByPipe,
        private datePipe: DatePipe,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.page = 1;
        this.reverse = false;
        this.orderProp = 'timestamp';
    }

    public loadPage(page: number): void {
        this.page = page;
        this.onChangeDate();
    }

    public ngOnInit(): void {
        this.today();
        this.previousMonth();
        this.onChangeDate();
    }

    public onChangeDate(): void {
        this.showLoader = true;
        this.auditsService
            .query({
                page: this.page - 1,
                size: this.itemsPerPage,
                fromDate: moment(this.fromDate).format('YYYY-MM-DD'),
                toDate: moment(this.toDate).format('YYYY-MM-DD'),
            })
            .subscribe((res) => {
                    this.audits = res.body;
                    this.links = this.parseLinks.parse(res.headers.get('link'));
                    this.totalItems = +res.headers.get('X-Total-Count');
                },
                (err) => console.info(err), // tslint:disable-line
                () => this.showLoader = false);
    }

    public previousMonth(): void {
        const dateFormat = 'yyyy-MM-dd';
        let fromDate: Date = new Date();

        if (fromDate.getMonth() === 0) {
            fromDate = new Date(fromDate.getFullYear() - 1, 11, fromDate.getDate());
        } else {
            fromDate = new Date(fromDate.getFullYear(), fromDate.getMonth() - 1, fromDate.getDate());
        }

        this.fromDate = this.datePipe.transform(fromDate, dateFormat);
    }

    public today(): void {
        const dateFormat = 'yyyy-MM-dd';
        // Today + 1 day - needed if the current day must be included
        const today: Date = new Date();
        today.setDate(today.getDate() + 1);
        const date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.toDate = this.datePipe.transform(date, dateFormat);
    }

    public sortAudits(audits: Audit[], prop: string): any {
        this.reverse = !this.reverse;
        return this.orderByPipe.transform(audits, prop, this.reverse);
    }
}
