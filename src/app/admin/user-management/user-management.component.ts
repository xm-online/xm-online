import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { XmAlertService } from '@xm-ngx/alert';
import { XmToasterService } from '@xm-ngx/toaster';

import { JhiEventManager, JhiParseLinks } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';

import { XM_EVENT_LIST } from '../../../app/xm.constants';
import { Principal, RoleService, User, UserLogin, UserLoginService, UserService } from '../../shared';
import { BaseAdminListComponent } from '../admin.service';
import { UserLoginMgmtDialogComponent } from './user-login-management-dialog.component';
import { UserMgmtDeleteDialogComponent } from './user-management-delete-dialog.component';
import { UserMgmtDialogComponent } from './user-management-dialog.component';

@Component({
    selector: 'xm-user-mgmt',
    templateUrl: './user-management.component.html',
})
export class UserMgmtComponent extends BaseAdminListComponent implements OnInit {

    public currentAccount: any;
    public list: User[];
    public eventModify: string = XM_EVENT_LIST.XM_USER_LIST_MODIFICATION;
    public navigateUrl: string = 'administration/user-management';
    public basePredicate: string = 'id';
    public login: string;
    public authorities: any[];
    public currentSearch: string;
    public onlineUsers: number = 0;

    constructor(protected activatedRoute: ActivatedRoute,
                protected toasterService: XmToasterService,
                protected alertService: XmAlertService,
                protected eventManager: JhiEventManager,
                protected parseLinks: JhiParseLinks,
                protected router: Router,
                private modalService: MatDialog,
                private userLoginService: UserLoginService,
                private userService: UserService,
                private roleService: RoleService,
                public principal: Principal) {
        super(activatedRoute, toasterService, alertService, eventManager, parseLinks, router);
        this.currentSearch = activatedRoute.snapshot.params.search || '';
    }

    public ngOnInit(): void {
        this.principal.identity().then((account) => {
            this.registerChangeInList();
            this.currentAccount = account;
            this.roleService.getRoles()
                .subscribe((roles) => this.authorities = roles.map((role) => role.roleKey).sort());
            this.userService.getOnlineUsers()
                .subscribe((result) => this.onlineUsers = result.body);
            this.loadAll();
        });
    }

    public changeState(user: User): void {
        this.alertService.open({
            title: user.activated ? `Block user?` : `Unblock user?`,
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes',
        }).subscribe((result) => result.value ?
            this.changeUserState(user) :
            console.info('Cancel'));
    }

    public getRegistrationEmail(user: User): string {
        if (!user || !user.logins) {
            return '';
        }

        for (const entry of user.logins) {
            if (entry.typeKey === 'LOGIN.EMAIL') {
                return entry.login;
            }
        }

        console.info('Key LOGIN.EMAIL not found %o', user.logins);
        return '';
    }

    public enable2FA(user: User): void {
        this.alertService.open({
            title: `Enable 2FA?`,
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, Enable',
        }).subscribe((result) => result.value ?
            this.userService.enable2FA(user.userKey, this.getRegistrationEmail(user))
                .subscribe(
                    () => {
                        user.tfaEnabled = true;
                        this.toasterService.success('userManagement.twoFAEnabled');
                    },
                    (error) => this.toasterService.error(error)) :
            console.info('Cancel'));
    }

    public disable2FA(user: User): void {
        this.alertService.open({
            title: `Disable 2FA?`,
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-button btn-primary',
            cancelButtonClass: 'btn mat-button',
            confirmButtonText: 'Yes, Disable',
        }).subscribe((result) => result.value ?
            this.userService.disable2FA(user.userKey)
                .subscribe(() => {
                        user.tfaEnabled = false;
                        this.toasterService.success('userManagement.twoFADisabled');
                    },
                    (error) => this.toasterService.error(error)) :
            console.info('Cancel'));
    }

    public loadAll(): void {
        this.showLoader = true;
        this.userService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            roleKey: this.currentSearch,
        }).subscribe((res) => this.list = this.onSuccess(res.body, res.headers),
            (err) => console.info(err),
            () => this.showLoader = false);
    }

    public trackIdentity(_index: number, item: User): any {
        return item.id;
    }

    public getLogin(login: UserLogin): string {
        return this.userLoginService.getLogin(login);
    }

    public applySearchByRole(roleKey: string): void {
        this.login = null;
        this.page = 1;
        this.previousPage = null;
        this.currentSearch = roleKey;
        this.transition();
    }

    public searchByLogin(): void | null {
        if (!(this.login && this.login.trim())) {
            this.loadAll();
            return null;
        }
        this.page = 1;
        this.currentSearch = null;
        this.loadFilteredUsers();
    }

    public loadFilteredUsers(): void {
        this.showLoader = true;
        this.userService.loginContains({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            roleKey: this.currentSearch,
            login: this.login,
        })
            .pipe(finalize(() => this.showLoader = false))
            .subscribe(
                (res) => {
                    this.list = [];
                    this.previousPage = null;
                    this.list = this.onSuccess(res.body, res.headers);
                },
                (err) => {
                    console.info(err);
                    this.list = [];
                });
    }

    public onAdd(): void {
        this.modalService.open(UserMgmtDialogComponent, {width: '500px'});
    }

    public onEdit(user: User): void {
        const modalRef = this.modalService.open(UserMgmtDialogComponent, {width: '500px'});
        modalRef.componentInstance.selectedUser = user;
    }

    public onLoginEdit(user: User): void {
        const modalRef = this.modalService.open(UserLoginMgmtDialogComponent, {width: '500px'});
        modalRef.componentInstance.user = user;
    }

    public onDelete(user: User): void {
        const modalRef = this.modalService.open(UserMgmtDeleteDialogComponent, {width: '500px'});
        modalRef.componentInstance.user = user;
    }

    public transition(): void {
        if (this.login) {
            this.loadFilteredUsers();
        } else {
            this.loadAll();
        }
    }

    private changeUserState(user: User): void {
        user.activated = !user.activated;
        this.userService.update(user).subscribe(() => {
            this.toasterService.success('userManagement.success');
        }, (err) => {
            console.info(err);
            this.toasterService.error('userManagement.error');
            user.activated = !user.activated;
        });
    }
}
