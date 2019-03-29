import { DomSanitizer } from '@angular/platform-browser';
import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';

import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';
import { Dashboard } from '../../../xm-dashboard/shared/dashboard.model';
import { DashboardService } from '../../../xm-dashboard/shared/dashboard.service';
import { BaseAdminConfigListComponent } from '../../base-admin-config-list.component';
import { DashboardDetailDialogComponent } from '../dashboard-detail-dialog/dashboard-detail-dialog.component';



@Component({
    selector: 'xm-dashboard-list-card',
    templateUrl: './dashboard-list-card.component.html',
    styleUrls: ['./dashboard-list-card.component.scss']
})
export class DashboardListCardComponent extends BaseAdminConfigListComponent implements OnInit {

    list: Dashboard[];
    eventModify = 'dashboardListModification';

    showLoader: boolean;

    constructor(protected dashboardService: DashboardService,
                private sanitizer: DomSanitizer,
                protected modalService: NgbModal,
                protected activatedRoute: ActivatedRoute,
                protected alertService: JhiAlertService,
                protected eventManager: JhiEventManager,
                protected parseLinks: JhiParseLinks,
                protected dashService: DashboardService,
                protected router: Router) {
        super(activatedRoute, alertService, eventManager, parseLinks, router);
        this.itemsPerPage = ITEMS_PER_PAGE;
    }

    loadAll() {
        this.showLoader = true;
        this.dashboardService.query(
            {
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort()
            }
        ).pipe(finalize(() => this.showLoader = false))
            .subscribe((res: HttpResponse<Dashboard[]>) => {
                this.totalItems = res.headers.get('X-Total-Count');
                this.list = res.body;
            });
    }

    trackIdentity(index, item) {
        return item.id;
    }

    onAddNew() {
        const modalRef = this.modalService.open(DashboardDetailDialogComponent, {backdrop: 'static', size: 'lg'});
        return modalRef;
    }

    onEdit(d: Dashboard) {
        const modalRef = this.modalService.open(DashboardDetailDialogComponent, {backdrop: 'static', size: 'lg'});
        modalRef.componentInstance.dashboard = Object.assign({}, d);
        return modalRef;
    }

    deleteAction(id: number) {
        this.dashboardService.delete(id).subscribe(
            (resp) => console.log(resp),
            (err) => console.log(err),
            () => this.eventManager.broadcast({
                name: this.eventModify,
                content: {id: 'delete', msg: `Dashboard ${id} deleted`}
            }));
    }

    exportDashboardsAndWidgets(): void {
        const mappedList = [];
        this.list.map((b, i) => {
            this.dashboardService.find(b.id).subscribe(result => {
                const dashboard = result.body || {};
                delete dashboard.id;
                if (dashboard.widgets && dashboard.widgets.length > 0) {
                    dashboard.widgets.map(w => {
                        delete w.id;
                        delete w.dashboard;
                    });
                }
                mappedList.push(dashboard);
                if ((i + 1) === this.list.length) {
                    this.saveJson(mappedList);
                }
            });
        });
    }

    onInputChange(event) {
        const reader = new FileReader();
        reader.onload = (e) => this.onReaderLoad(e);
        reader.readAsText(event.target.files[0]);
    }

    onReaderLoad(event): void {
        const dashboardsArray = JSON.parse(event.target.result);
        for (let i = 0; i <= dashboardsArray.length;) {
            console.log(i);
            this.setDashboard(dashboardsArray[i]).subscribe(res => i++);
        }
    }

    private setDashboard(dashboard: Dashboard): Observable<any> {
        return this.dashboardService.create(dashboard);
    }

    private saveJson(data: any): void {
        if (data && data.length === 0) {console.log('qwewqe')}
        const a = window.document.createElement('a');
        const theJSON = JSON.stringify(data);
        const blob = new Blob([theJSON], { type: 'text/json' });
        const url = window.URL.createObjectURL(blob);
        a.href = window.URL.createObjectURL(blob);
        a.download = 'dashboards.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    protected deleteItem(d: Dashboard) {
        this.onDeleteItem(d.id, d.name)
    }

}
