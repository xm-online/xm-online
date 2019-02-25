import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {JhiEventManager} from 'ng-jhipster';
import {NgForm} from '@angular/forms';
import {UserLoginService} from './user-login.service';
import {UserLogin} from './user-login.model';
import {UserService} from '../user.service';
import {User} from '../user.model';
import {AccountService} from '../../auth/account.service';
import {Principal} from '../../auth/principal.service';
import {XM_EVENT_LIST} from '../../../../app/xm.constants';

@Component({
    selector: 'xm-user-login-form',
    templateUrl: './user-login-form.component.html'
})
export class UserLoginFormComponent implements OnChanges {

    @Input()
    private user: User;
    @Input()
    isUser: Boolean = false;
    @Input()
    isCreate: Boolean = false;

    isSaving: Boolean;
    userLogins: any = [];
    success: Boolean;

    constructor(private activeModal: NgbActiveModal,
                private userService: UserService,
                private accountService: AccountService,
                private principal: Principal,
                private eventManager: JhiEventManager,
                private userLoginService: UserLoginService) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.reload();
    }

    isSubmitValid(editForm: NgForm): boolean {
        for (const key in editForm.value) {
            if (editForm.value[key]) {
                return true;
            }
        }
        return false;
    }

    clear() {
        if (this.isUser && !this.isCreate) {
            this.activeModal.dismiss('cancel');
        }
    }

    save() {
        if (this.isCreate) {
            return;
        }
        this.isSaving = true;
        this.createLogins();
        if (this.isUser) {
            this.userService.updateLogins(this.user).subscribe((response) => this.onSaveSuccess(response),
                () => this.onSaveError());
        } else {
            this.accountService.updateLogins(this.user).subscribe((response) => this.onSaveSuccess(response),
                () => this.onSaveError());
        }
    }

    createLogins() {
        this.user.logins = [];
        this.userLogins.filter(login => login.value).forEach(login => {
            this.user.logins.push(new UserLogin(login.id, login.key, null, login.value, false));
        });
    }

    private reload() {
        this.isSaving = false;
        this.userLogins = [];

        this.userLoginService.getAllLogins().then(allLogins => {
            Object.keys(allLogins).forEach(typeKey => {
                this.userLogins.push({'key': typeKey, 'name': this.userLoginService.getName(typeKey)});
            });
            if (this.user.logins) {
                this.user.logins.forEach(login => {
                    let info = this.userLogins.find(info => info['key'] === login.typeKey);
                    if (info) {
                        info.value = login.login;
                        info.id = login.id;
                    }
                });
            }
        });
    }

    private onSaveSuccess(result) {
        this.isSaving = false;
        this.success = true;
        if (this.isUser) {
            this.eventManager.broadcast({name: XM_EVENT_LIST.XM_USER_LIST_MODIFICATION, content: 'OK'});
            this.activeModal.dismiss(result);
        } else {
            this.principal.identity(true).then((account) => {
                this.user = account;
                this.reload();
            });
        }
    }

    private onSaveError() {
        this.isSaving = false;
        this.success = false;
    }

}
