import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { XmEventManager } from '@xm-ngx/core';

import { XM_EVENT_LIST } from '../../../app/xm.constants';
import { JhiLanguageHelper, User, UserService } from '../../shared';
import { RoleService } from '../../shared/role/role.service';
import { XmConfigService } from '../../shared/spec/config.service';

@Component({
    selector: 'xm-user-mgmt-dialog',
    templateUrl: './user-management-dialog.component.html',
})
export class UserMgmtDialogComponent implements OnInit {

    public user: User;
    public languages: any[];
    public authorities: any[];
    public showLoader: boolean;
    @ViewChild('userLoginForm', {static: false}) public userLoginForm: any;
    @Input() public selectedUser: User;

    constructor(
        public activeModal: MatDialogRef<UserMgmtDialogComponent>,
        private languageHelper: JhiLanguageHelper,
        private xmConfigService: XmConfigService,
        private userService: UserService,
        private roleService: RoleService,
        private eventManager: XmEventManager,
    ) {
    }

    public ngOnInit(): void {
        if (this.selectedUser) {
            this.user = this.selectedUser;
        } else {
            this.user = new User();
        }
        this.roleService.getRoles().subscribe((roles) => {
            this.authorities = roles.map((role) => role.roleKey).sort();
        });
        this.languageHelper.getAll().then((languages) => {
            this.xmConfigService.getUiConfig().subscribe((config) => {
                this.languages = (config && config.langs) ? config.langs : languages;
            });
        });
    }

    public clear(): void {
        this.activeModal.close(false);
    }

    public save(): void {
        this.showLoader = true;
        if (!this.user.id) {
            this.userLoginForm.createLogins();
        }
        this.userService[this.user.id ? 'update' : 'create'](this.user)
            .subscribe((response) => this.onSaveSuccess(response),
                (err) => console.info(err),
                () => this.showLoader = false);
    }

    private onSaveSuccess(result: any): void {
        this.eventManager.broadcast({name: XM_EVENT_LIST.XM_USER_LIST_MODIFICATION, content: 'OK'});
        this.activeModal.close(result);
    }

}
