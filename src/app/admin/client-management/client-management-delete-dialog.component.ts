import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

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
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
    ) {
    }

    public ngOnInit(): void {
        if (this.selectedClient) {
            this.client = new Client(this.selectedClient.id);
        }
    }

    public clear(): void {
        this.activeModal.dismiss('cancel');
    }

    public confirmDelete(id: any): void {
        this.showLoader = true;
        this.clientService.delete(id)
            .subscribe(() => {
                    this.eventManager.broadcast({
                        name: 'clientListModification',
                        content: {id: 'delete', msg: 'Deleted a client'},
                    });
                    this.activeModal.dismiss(true);
                },
                (err) => {
                    console.info(err); // tslint:disable-line
                    this.showLoader = false;
                },
                () => this.showLoader = false);
    }
}
