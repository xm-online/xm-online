import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { XmAlertService } from '@xm-ngx/alert';
import { XmEventManager } from '@xm-ngx/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiParseLinks } from 'ng-jhipster';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { finalize } from 'rxjs/operators';

import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';
import { Dashboard } from '../../../xm-dashboard/shared/dashboard.model';
import { DashboardService } from '../../../xm-dashboard/shared/dashboard.service';
import { BaseAdminConfigListComponent } from '../../base-admin-config-list.component';
import { DashboardDetailDialogComponent } from '../dashboard-detail-dialog/dashboard-detail-dialog.component';


@Component({
    selector: 'xm-dashboard-list-card',
    templateUrl: './dashboard-list-card.component.html',
    styleUrls: ['./dashboard-list-card.component.scss'],
})
export class DashboardListCardComponent extends BaseAdminConfigListComponent implements OnInit {

    public list: Dashboard[];
    public eventModify: string = 'dashboardListModification';

    public showLoader: boolean;

    constructor(protected dashboardService: DashboardService,
                protected modalService: MatDialog,
                protected activatedRoute: ActivatedRoute,
                protected toasterService: XmToasterService,
                protected alertService: XmAlertService,
                protected eventManager: XmEventManager,
                protected parseLinks: JhiParseLinks,
                protected translateService: TranslateService,
                protected router: Router) {
        super(activatedRoute, toasterService, alertService, eventManager, parseLinks, router);
        this.itemsPerPage = ITEMS_PER_PAGE;
    }

    public loadAll(): void {
        this.showLoader = true;
        this.dashboardService.query(
            {
                page: this.page - 1,
                size: this.itemsPerPage,
                sort: this.sort(),
            },
        ).pipe(finalize(() => this.showLoader = false))
            .subscribe((res: HttpResponse<Dashboard[]>) => {
                this.totalItems = res.headers.get('X-Total-Count');
                this.list = res.body;
            });
    }

    public trackIdentity(_index: any, item: any): any {
        return item.id;
    }

    public onAddNew(): void {
        this.modalService.open(DashboardDetailDialogComponent, {width: '500px'});
    }

    public onEdit(d: Dashboard): void {
        const modalRef = this.modalService.open(DashboardDetailDialogComponent, {width: '500px'});
        modalRef.componentInstance.dashboard = Object.assign({}, d);
    }

    public deleteItem(d: Dashboard): void {
        this.onDeleteItem(d.id, d.name);
    }

    public deleteAction(id: number): void {
        this.dashboardService.delete(id).subscribe(
            (resp) => console.info(resp), // tslint:disable-line
            (err) => console.info(err), // tslint:disable-line
            () => this.eventManager.broadcast({
                name: this.eventModify,
                content: {id: 'delete', msg: `Dashboard ${id} deleted`},
            }));
    }

    public exportDashboardsAndWidgets(): void {
        const mappedList = [];
        this.list.forEach((b, i) => {
            this.dashboardService.find(b.id).subscribe((result) => {
                const dashboard = result.body || {};
                delete dashboard.id;
                if (dashboard.widgets && dashboard.widgets.length > 0) {
                    dashboard.widgets.forEach((w) => {
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

    public onInputChange(event: any): void {
        const reader = new FileReader();
        reader.onload = (e) => this.onReaderLoad(e);
        reader.readAsText(event.target.files[0]);
    }

    public onReaderLoad(event: any): void {
        this.alertService.open({
            type: 'warning',
            text: this.translateService.instant('admin-config.common.confirm'),
            buttonsStyling: false,
            showCancelButton: true,
            cancelButtonText: this.translateService.instant('admin-config.common.cancel'),
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn',
        }).subscribe((confirm) => {
            if (confirm.value) {
                this.showLoader = true;
                const dashboardsArray = JSON.parse(event.target.result);
                for (let i = 0; i < dashboardsArray.length; i++) {
                    this.setDashboard(dashboardsArray[i]).subscribe(
                        () => {
                            if ((i + 1) === dashboardsArray.length) {
                                this.toasterService.success('admin-config.dashboard-detail-dialog.add.success');
                                this.loadAll();
                            }
                        }, (err) => {
                            console.info(err); // tslint:disable-line
                            this.showLoader = false;
                        });
                }
            }
        });
    }

    private setDashboard(dashboard: Dashboard): Observable<any> {
        return this.dashboardService.create(dashboard);
    }

    private saveJson(data: any): void {
        const a = window.document.createElement('a');
        const theJSON = JSON.stringify(data);
        const blob = new Blob([theJSON], {type: 'text/json'});
        a.href = window.URL.createObjectURL(blob);
        a.download = 'dashboards.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

}
