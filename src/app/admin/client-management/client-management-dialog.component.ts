import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { finalize, map, startWith } from 'rxjs/operators';

import { Client, ClientService, JhiLanguageHelper, RoleService, XmConfigService } from '../../shared';
import { Observable } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent, MatChipInputEvent } from '@angular/material';

export const CLIENT_UNIQUE_ID_ERROR_CODE = 'client.already.exists';

@Component({
    selector: 'xm-client-mgmt-dialog',
    styleUrls: ['../client-management/client-management-dialog.component.scss'],
    templateUrl: './client-management-dialog.component.html',
})
export class ClientMgmtDialogComponent implements OnInit {

    @Input() public selectedClient: Client;

    @ViewChild('editForm', {static: false}) public editForm: NgForm;
    public client: Client;
    @ViewChild('scopeInput', {static: false})
    public scopeInput: ElementRef<HTMLInputElement>;
    @ViewChild('auto', {static: false})
    public matAutocomplete: MatAutocomplete;

    public languages: any[];
    public scopes: any[] = [];
    public authorities: any[];
    public showLoader: boolean;
    public clientIdNotUnique: boolean;
    public scopesVariants: any[] = [];
    public separatorKeysCodes: number[] = [ENTER, COMMA];
    public scopeCtrl: FormControl = new FormControl();
    public filteredScopes: Observable<string[]>;

    constructor(public activeModal: NgbActiveModal,
                private languageHelper: JhiLanguageHelper,
                private clientService: ClientService,
                private roleService: RoleService,
                private eventManager: JhiEventManager,
                private xmConfigService: XmConfigService) {
        this.filteredScopes = this.scopeCtrl.valueChanges.pipe(
            startWith(null),
            map((scope: string | null) => scope ? this._filter(scope) : this.scopesVariants.slice()));
    }

    public add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            this.scopes.push(value.trim());
        }

        if (input) {
            input.value = '';
        }

        this.scopeCtrl.setValue(null);
    }

    public remove(scope: string): void {
        const index = this.scopes.indexOf(scope);
        if (index >= 0) {
            this.scopes.splice(index, 1);
        }
    }

    public selected(event: MatAutocompleteSelectedEvent): void {
        this.scopes.push(event.option.viewValue);
        this.scopeInput.nativeElement.value = '';
        this.scopeCtrl.setValue(null);
    }

    private _filter(value: string): string[] {
        const filterValue = value.toLowerCase();
        return this.scopesVariants.filter(scope => scope.toLowerCase().indexOf(filterValue) >= 0);
    }

    public ngOnInit(): void {
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
                this.selectedClient.scopes || [],
            );
        } else {
            this.client = new Client();
        }
        this.roleService.getRoles().subscribe((roles) => {
            this.authorities = roles.map((role) => role.roleKey).sort();
        });
        this.xmConfigService.getUiConfig().subscribe((config) => {
            this.languageHelper.getAll().then((languages) => {
                this.languages = (config && config.langs) ? config.langs : languages;
            });
            if (config.client) {
                this.scopesVariants = config.client.scopes || [];
            }
        });
        this.scopes = this.client.scopes;
    }

    public clear(): void {
        this.activeModal.dismiss('cancel');
    }

    public save(): void {
        this.clientIdNotUnique = false;
        this.showLoader = true;
        this.client.clientId = this.client.clientId.trim();
        if (this.client.description) {
            this.client.description = this.client.description.trim();
        }
        this.client.scopes = this.scopes || [];
        this.clientService[this.client.id ? 'update' : 'create'](this.client)
            .pipe(finalize(() => this.showLoader = false))
            .subscribe(
            (response) => this.onSaveSuccess(response),
            (err) => this.checkErrorForClientId(err));
    }

    private onSaveSuccess(result: any): void {
        this.eventManager.broadcast({name: 'clientListModification', content: 'OK'});
        this.activeModal.dismiss(result);
    }

    private checkErrorForClientId(err: any): void {
        this.clientIdNotUnique = err && err.error && err.error.error === CLIENT_UNIQUE_ID_ERROR_CODE;
        const ctrlKey = 'clientId';
        if (this.clientIdNotUnique) {
            const ctrl = this.editForm.form.controls[ctrlKey];
            ctrl.setErrors(['valueNotUnique'],{emitEvent: true});
        }
    }

}
