import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import { finalize } from 'rxjs/operators';

import { ITEMS_PER_PAGE } from '../../../shared/constants/pagination.constants';
import { Dashboard } from '../../../xm-dashboard/shared/dashboard.model';
import { DashboardService } from '../../../xm-dashboard/shared/dashboard.service';
import { BaseAdminConfigListComponent } from '../../base-admin-config-list.component';
import { DashboardDetailDialogComponent } from '../dashboard-detail-dialog/dashboard-detail-dialog.component';

declare let swal: any;

@Component({
    selector: 'xm-dashboard-list-card',
    templateUrl: './dashboard-list-card.component.html',
    styleUrls: ['./dashboard-list-card.component.scss'],
})
export class DashboardListCardComponent extends BaseAdminConfigListComponent implements OnInit {

    list: Dashboard[];
    eventModify = 'dashboardListModification';

    showLoader: boolean;

    constructor(protected dashboardService: DashboardService,
                protected modalService: NgbModal,
                protected activatedRoute: ActivatedRoute,
                protected alertService: JhiAlertService,
                protected eventManager: JhiEventManager,
                protected parseLinks: JhiParseLinks,
                protected translateService: TranslateService,
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
                sort: this.sort(),
            },
        ).pipe(finalize(() => this.showLoader = false))
            .subscribe((res: HttpResponse<Dashboard[]>) => {
                this.totalItems = res.headers.get('X-Total-Count');
                this.list = res.body;
            });
    }

    trackIdentity(index, item) {
        return item.id;
    }

    public onAddNew(): void {
        this.modalService.open(DashboardDetailDialogComponent, {backdrop: 'static', size: 'lg'});
    }

    public onEdit(d: Dashboard): void {
        const modalRef = this.modalService.open(DashboardDetailDialogComponent, {backdrop: 'static', size: 'lg'});
        modalRef.componentInstance.dashboard = Object.assign({}, d);
    }

    public deleteItem(d: Dashboard) {
        this.onDeleteItem(d.id, d.name);
    }

    deleteAction(id: number) {
        this.dashboardService.delete(id).subscribe(
            (resp) => console.log(resp), // tslint:disable-line
            (err) => console.log(err), // tslint:disable-line
            () => this.eventManager.broadcast({
                name: this.eventModify,
                content: {id: 'delete', msg: `Dashboard ${id} deleted`},
            }));
    }

    exportDashboardsAndWidgets(): void {
        const mappedList = [];
        this.list.map((b, i) => {
            this.dashboardService.find(b.id).subscribe((result) => {
                const dashboard = result.body || {};
                delete dashboard.id;
                if (dashboard.widgets && dashboard.widgets.length > 0) {
                    dashboard.widgets.map((w) => {
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
        swal({
            type: 'warning',
            text: this.translateService.instant('admin-config.common.confirm'),
            buttonsStyling: false,
            showCancelButton: true,
            cancelButtonText: this.translateService.instant('admin-config.common.cancel'),
            confirmButtonClass: 'btn btn-primary',
            cancelButtonClass: 'btn',
        }).then((confirm) => {
            if (confirm.value) {
                this.showLoader = true;
                const dashboardsArray = JSON.parse(event.target.result);
                for (let i = 0; i < dashboardsArray.length; i++) {
                    this.setDashboard(dashboardsArray[i]).subscribe(
                        (res) => {
                            if ((i + 1) === dashboardsArray.length) {
                                this.alert('success', 'admin-config.dashboard-detail-dialog.add.success');
                                this.loadAll();
                            }
                        }, (err) => {
                            console.log(err); // tslint:disable-line
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
        const blob = new Blob([theJSON], { type: 'text/json' });
        a.href = window.URL.createObjectURL(blob);
        a.download = 'dashboards.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    private alert(type, key) {
        swal({
            type,
            text: this.translateService.instant(key),
            buttonsStyling: false,
            confirmButtonClass: 'btn btn-primary',
        });
    }
}
