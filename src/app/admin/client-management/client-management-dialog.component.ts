import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { ViewChild } from '@angular/core';

import { JhiLanguageHelper, Client, ClientService } from '../../shared';
import { RoleService } from '../../shared/role/role.service';
import { XmConfigService } from '../../shared/spec/config.service';

@Component({
    selector: 'xm-client-mgmt-dialog',
    styleUrls: ['../client-management/client-management-dialog.component.scss'],
    templateUrl: './client-management-dialog.component.html'
})
export class ClientMgmtDialogComponent implements OnInit {

    @Input() selectedClient: Client;
    client: Client;
    languages: any[];
    scopes: any[];
    authorities: any[];
    showLoader: Boolean;
    @ViewChild('userLoginForm', {static: false}) userLoginForm;

    constructor(public activeModal: NgbActiveModal,
                private languageHelper: JhiLanguageHelper,
                private clientService: ClientService,
                private roleService: RoleService,
                private eventManager: JhiEventManager,
                private xmConfigService: XmConfigService) {
    }

    ngOnInit() {
        if (this.selectedClient) {
            this.client = new Client(
                this.selectedClient.id,
                this.selectedClient.clientId,
                this.selectedClient.clientSecret,
                this.selectedClient.roleKey,
                this.selectedClient.description,
                this.selectedClient.createdBy,
                this.selectedClient.createdDate,
                this.selectedClient.lastModifiedBy,
                this.selectedClient.lastModifiedDate,
                this.selectedClient.accessTokenValiditySeconds,
                this.setFormSources(this.selectedClient.scopes)
            );
        } else {
            this.client = new Client();
        }
        this.roleService.getRoles().subscribe(roles => {
            this.authorities = roles.map(role => role.roleKey).sort();
        });
        this.languageHelper.getAll().then((languages) => {
            this.xmConfigService.getUiConfig().subscribe(config => {
                this.languages = (config && config.langs) ? config.langs : languages;
            });
        });
        this.scopes = this.client.scopes;
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.showLoader = true;
        this.client.clientId = this.client.clientId.trim();
        this.client.description && (this.client.description = this.client.description.trim());
        this.client.scopes = (this.scopes || []).map(it => it.value);
        this.clientService[this.client.id ? 'update' : 'create'](this.client)
            .subscribe(
                (response) => this.onSaveSuccess(response),
                (err) => {
                    console.log(err);
                    this.showLoader = false;
                },
                () => this.showLoader = false);
    }

    protected setFormSources(sources: string[]): any[] {
        if (!sources) {return []}
        return sources.map(s => {return {display: s, value: s}});
    }

    private onSaveSuccess(result) {
        this.eventManager.broadcast({ name: 'clientListModification', content: 'OK' });
        this.activeModal.dismiss(result);
    }

}
