import {HttpResponse} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import {finalize} from 'rxjs/operators';

import {JhiLanguageHelper} from '../../../shared';
import {Dashboard, Widget, WidgetService} from '@xm-ngx/dynamic';
import {DashboardService} from '@xm-ngx/dynamic';
import {XmEntity} from '../../../xm-entity';
import {BaseAdminConfigListComponent} from '../../base-admin-config-list.component';
import {WidgetDetailDialogComponent} from '../widget-detail-dialog/widget-detail-dialog.component';

@Component({
    selector: 'xm-widget-list-card',
    templateUrl: './widget-list-card.component.html',
    styleUrls: ['./widget-list-card.component.scss'],
})
export class WidgetListCardComponent extends BaseAdminConfigListComponent implements OnInit {

    public dashboardId: number;
    public list: Widget[];
    public eventModify: string;
    public activatedRouteData: any;

    public showLoader: boolean;

    constructor(protected dashboardService: DashboardService,
                protected widgetService: WidgetService,
                protected jhiLanguageHelper: JhiLanguageHelper,
                protected modalService: MatDialog,
                protected activatedRoute: ActivatedRoute,
                protected alertService: XmAlertService,
                protected toasterService: XmToasterService,
                protected eventManager: JhiEventManager,
                protected parseLinks: JhiParseLinks,
                protected router: Router) {
        super(activatedRoute, toasterService, alertService, eventManager, parseLinks, router);
        this.activatedRoute.data.subscribe((data) => {
            this.activatedRouteData = data;
        });
        this.activatedRoute.params.subscribe((params) => {
            this.dashboardId = params.id;
        });
        this.eventModify = 'widgetListModification';
    }

    public loadAll(): void {
        this.showLoader = true;
        this.dashboardService.find(this.dashboardId).pipe(finalize(() => this.showLoader = false))
            .subscribe((res: HttpResponse<Dashboard>) => {
                this.list = res.body.widgets;
                this.activatedRouteData.pageSubSubTitle = res.body.name;
                this.jhiLanguageHelper.updateTitle();
            });
    }

    public trackIdentity(index: number | string, item: XmEntity): number {
        return item.id;
    }

    public onAddNew(): void {
        const modalRef = this.modalService.open(WidgetDetailDialogComponent, {width: '500px'});
        modalRef.componentInstance.dashboardId = this.dashboardId;
    }

    public onEdit(w: Widget): void {
        const modalRef = this.modalService.open(WidgetDetailDialogComponent, {width: '500px'});
        modalRef.componentInstance.dashboardId = this.dashboardId;
        modalRef.componentInstance.widget = Object.assign({}, w);
    }

    public deleteAction(id: number): void {
        this.widgetService
            .delete(id)
            .pipe(finalize(() => {
                this.eventManager.broadcast({
                    name: this.eventModify,
                    content: {id: 'delete', msg: `Widget ${id} deleted`},
                });
            })).subscribe();
    }

    public deleteItem(w: Widget): void {
        this.onDeleteItem(w.id, w.name);
    }

}
