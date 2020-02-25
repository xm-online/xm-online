import { Component } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';

import { Client, ClientService } from '../../shared';
import { BaseAdminListComponent } from '../admin.service';
import { ClientMgmtDeleteDialogComponent } from './client-management-delete-dialog.component';
import { ClientMgmtDialogComponent } from './client-management-dialog.component';

@Component({
    selector: 'xm-client-mgmt',
    templateUrl: './client-management.component.html',
})
export class ClientMgmtComponent extends BaseAdminListComponent {

    public list: Client[];
    public eventModify: string = 'clientListModification';
    public navigateUrl: string = 'administration/client-management';
    public basePredicate: string = 'lastModifiedDate';
    public clientId: string;

    constructor(
        protected clientService: ClientService,
        protected activatedRoute: ActivatedRoute,
        protected toasterService: XmToasterService,
        protected alertService: XmAlertService,
        protected eventManager: JhiEventManager,
        protected parseLinks: JhiParseLinks,
        private modalService: MatDialog,
        protected router: Router,
    ) {
        super(activatedRoute, toasterService, alertService, eventManager, parseLinks, router);
        this.itemsPerPage = 10;
    }

    public loadAll(): void {
        this.showLoader = true;
        this.clientService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
        }).subscribe(
            (res) => this.list = this.onSuccess(res.body, res.headers),
            (err) => {
                console.info(err); // tslint:disable-line
                this.onError(err);
                this.showLoader = false;
            },
            () => this.showLoader = false);
    }

    public trackIdentity(_index: any, item: Client): any {
        return item.id;
    }

    public transition(): void {
        if (this.clientId) {
            this.loadClientsById(this.clientId);
        } else {
            this.loadAll();
        }
    }

    public filterByClientId(clientId: string): void | null {
        this.clientId = clientId;
        if (!(clientId && clientId.trim())) {
            this.loadAll();
            return null;
        }
        this.page = 1;
        this.loadClientsById(this.clientId);
    }

    public onDelete(client: any): void {
        const modalRef = this.modalService.open(ClientMgmtDeleteDialogComponent, {width: '500px'});
        modalRef.componentInstance.selectedClient = client;
    }

    public onEdit(client: any): void {
        const modalRef = this.modalService.open(ClientMgmtDialogComponent, {width: '500px'});
        modalRef.componentInstance.selectedClient = client;
    }

    public onAdd(): void {
        this.modalService.open(ClientMgmtDialogComponent, {width: '500px'});
    }

    private loadClientsById(clientId: string): void {
        this.showLoader = true;
        const CLIENT_ID = clientId.trim();
        this.clientService.filterByClientId({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            clientId: CLIENT_ID,
        })
            .pipe(finalize(() => this.showLoader = false))
            .subscribe(
                (res) => {
                    this.list = [];
                    this.list = this.onSuccess(res.body, res.headers);
                },
                (err) => {
                    this.onError(err);
                    this.showLoader = false;
                });
    }
}
