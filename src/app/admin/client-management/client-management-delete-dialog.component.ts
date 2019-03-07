import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager, JhiLanguageService } from 'ng-jhipster';

import { Client, ClientService } from '../../shared';

@Component({
    selector: 'xm-client-mgmt-delete-dialog',
    templateUrl: './client-management-delete-dialog.component.html'
})
export class ClientMgmtDeleteDialogComponent implements OnInit {

    @Input() selectedClient: Client;
    showLoader: boolean;
    client: Client;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private clientService: ClientService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        if (this.selectedClient) {
            this.client = new Client(this.selectedClient.id);
        }
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(id) {
        this.showLoader = true;
        this.clientService.delete(id)
            .subscribe((response) => {
                    this.eventManager.broadcast({
                        name: 'clientListModification',
                        content: {id: 'delete', msg: 'Deleted a client'}
                    });
                    this.activeModal.dismiss(true);
                },
                (err) => {
                    console.log(err);
                    this.showLoader = false;
                },
                () => this.showLoader = false);
    }
}
