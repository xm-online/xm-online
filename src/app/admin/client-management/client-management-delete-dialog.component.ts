import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { XmEventManager } from '@xm-ngx/core';

import { Client, ClientService } from '../../shared';

@Component({
    selector: 'xm-client-mgmt-delete-dialog',
    templateUrl: './client-management-delete-dialog.component.html',
})
export class ClientMgmtDeleteDialogComponent implements OnInit {

    @Input() public selectedClient: Client;
    public showLoader: boolean;
    public client: Client;

    constructor(
        private clientService: ClientService,
        public activeModal: MatDialogRef<ClientMgmtDeleteDialogComponent>,
        private eventManager: XmEventManager,
    ) {
    }

    public ngOnInit(): void {
        if (this.selectedClient) {
            this.client = new Client(this.selectedClient.id);
        }
    }

    public clear(): void {
        this.activeModal.close(false);
    }

    public confirmDelete(id: any): void {
        this.showLoader = true;
        this.clientService.delete(id).subscribe(
            () => {
                this.eventManager.broadcast({
                    name: 'clientListModification',
                    content: {id: 'delete', msg: 'Deleted a client'},
                });
                this.activeModal.close(true);
            },
            (err) => {
                console.info(err);
                this.showLoader = false;
            },
            () => this.showLoader = false);
    }
}
