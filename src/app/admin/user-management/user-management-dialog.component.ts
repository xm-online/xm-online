import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { ViewChild } from '@angular/core';

import { JhiLanguageHelper, User, UserService } from '../../shared';
import { RoleService } from '../../shared/role/role.service';
import { XM_EVENT_LIST } from '../../../app/xm.constants';
import { XmConfigService } from '../../shared/spec/config.service';

@Component({
    selector: 'xm-user-mgmt-dialog',
    templateUrl: './user-management-dialog.component.html'
})
export class UserMgmtDialogComponent implements OnInit {

    user: User;
    languages: any[];
    authorities: any[];
    showLoader: Boolean;
    @ViewChild('userLoginForm', {static: false}) userLoginForm;
    @Input() selectedUser: User;

    constructor(
        public activeModal: NgbActiveModal,
        private languageHelper: JhiLanguageHelper,
        private xmConfigService: XmConfigService,
        private userService: UserService,
        private roleService: RoleService,
        private eventManager: JhiEventManager
    ) {}

    ngOnInit() {
        if (this.selectedUser) {
            this.user = this.selectedUser;
        } else {
            this.user = new User();
        }
        this.roleService.getRoles().subscribe(roles => {
            this.authorities = roles.map(role => role.roleKey).sort();
        });
        this.languageHelper.getAll().then((languages) => {
            this.xmConfigService.getUiConfig().subscribe(config => {
                this.languages = (config && config.langs) ? config.langs : languages;
            });
        });
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    save() {
        this.showLoader = true;
        this.user.id || this.userLoginForm.createLogins();
        this.userService[this.user.id ? 'update' : 'create'](this.user)
            .subscribe((response) => this.onSaveSuccess(response),
                (err) => console.log(err),
                () => this.showLoader = false);
    }

    private onSaveSuccess(result) {
        this.eventManager.broadcast({ name: XM_EVENT_LIST.XM_USER_LIST_MODIFICATION, content: 'OK' });
        this.activeModal.dismiss(result);
    }

}
