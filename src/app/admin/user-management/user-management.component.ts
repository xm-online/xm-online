import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiAlertService, JhiEventManager, JhiParseLinks } from 'ng-jhipster';

import swal from 'sweetalert2';
import { XM_EVENT_LIST } from '../../../app/xm.constants';
import { Principal, RoleService, User, UserLogin, UserLoginService, UserService } from '../../shared';
import { BaseAdminListComponent } from '../admin.service';
import { UserMgmtDialogComponent } from './user-management-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserMgmtDeleteDialogComponent } from './user-management-delete-dialog.component';
import { UserLoginMgmtDialogComponent } from './user-login-management-dialog.component';


@Component({
    selector: 'xm-user-mgmt',
    templateUrl: './user-management.component.html'
})
export class UserMgmtComponent extends BaseAdminListComponent implements OnInit {

    currentAccount: any;
    list: User[];
    eventModify: string = XM_EVENT_LIST.XM_USER_LIST_MODIFICATION;
    navigateUrl = 'administration/user-management';
    basePredicate = 'id';
    login: string;
    authorities: any[];
    currentSearch: string;
    onlineUsers = 0;

    constructor(protected activatedRoute: ActivatedRoute,
                protected alertService: JhiAlertService,
                protected eventManager: JhiEventManager,
                protected parseLinks: JhiParseLinks,
                protected router: Router,
                private modalService: NgbModal,
                private userLoginService: UserLoginService,
                private userService: UserService,
                private roleService: RoleService,
                public principal: Principal) {
        super(activatedRoute, alertService, eventManager, parseLinks, router);
        this.currentSearch = activatedRoute.snapshot.params['search'] || '';
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.registerChangeInList();
            this.currentAccount = account;
            this.roleService.getRoles().subscribe(roles => this.authorities = roles.map(role => role.roleKey).sort());
            this.userService.getOnlineUsers().subscribe(result => this.onlineUsers = result.body);
            this.loadAll();
        });
    }


    private changeUserState(user) {
        user.activated = !user.activated;
        this.userService.update(user).subscribe(() => {
            this.alertService.success('userManagement.success');
        }, err => {
            console.log(err);
            this.alertService.error('userManagement.error');
            user.activated = !user.activated
        });
    }

    protected changeState(user) {
        swal({
            title: user.activated ? `Block user?` : `Unblock user?`,
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: 'Yes'
        }).then((result) => result.value ?
            this.changeUserState(user) :
            console.log('Cancel'))
    }

    getRegistrationEmail(user: User): string {
        if (!user || !user.logins) {
            return '';
        }

        for (const entry of user.logins) {
            if (entry.typeKey = 'LOGIN.EMAIL') {
                return entry.login;
            }
        }

        console.log('Key LOGIN.EMAIL not found %o', user.logins);
        return '';
    }

    enable2FA(user: User) {
        swal({
            title: `Enable 2FA?`,
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: 'Yes, Enable'
        }).then((result) => result.value ?
            this.userService.enable2FA(user.userKey, this.getRegistrationEmail(user))
                .subscribe(resp => {
                        user.tfaEnabled = true;
                        this.alertService.success('userManagement.twoFAEnabled')
                    },
                    error => this.alertService.error(error)) :
            console.log('Cancel'))
    }

    disable2FA(user: User) {
        swal({
            title: `Disable 2FA?`,
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: 'Yes, Disable'
        }).then((result) => result.value ?
            this.userService.disable2FA(user.userKey)
                .subscribe(resp => {
                        user.tfaEnabled = false;
                        this.alertService.success('userManagement.twoFADisabled')
                    },
                    error => this.alertService.error(error)) :
            console.log('Cancel'));
    }

    loadAll() {
        this.showLoader = true;
        this.userService.query({
            page: this.page - 1,
            size: this.itemsPerPage,
            sort: this.sort(),
            roleKey: this.currentSearch
        }).subscribe((res) => this.list = this.onSuccess(res.body, res.headers),
            (err) => console.log(err),
            () => this.showLoader = false);
    }

    trackIdentity(index, item: User) {
        return item.id;
    }

    getLogin(login: UserLogin) {
        return this.userLoginService.getLogin(login)
    }

    applySearchByRole(roleKey: string) {
        this.login = '';
        this.page = 1;
        this.previousPage = null;
        this.currentSearch = roleKey;
        this.transition();
    }

    searchByLogin() {
        if (!(this.login && this.login.trim())) {
            return this.loadAll();
        }
        this.showLoader = true;

        this.userService.findByLogin(this.login)
            .subscribe((res) => {
                    this.page = 1;
                    this.previousPage = null;
                    this.totalItems = 1;
                    this.queryCount = this.totalItems;
                    this.list = [res.body]
                },
                (err) => {
                    this.showLoader = false;
                    console.log(err);
                    this.list = []
                },
                () => this.showLoader = false);
    }

    private onAdd() {
        const modalRef = this.modalService.open(UserMgmtDialogComponent, { backdrop: 'static', size: 'lg' });
    }

    private onEdit(user) {
        const modalRef = this.modalService.open(UserMgmtDialogComponent, { backdrop: 'static', size: 'lg' });
        modalRef.componentInstance.selectedUser = user;
    }

    private onLoginEdit(user) {
        const modalRef = this.modalService.open(UserLoginMgmtDialogComponent, { backdrop: 'static', size: 'lg' });
        modalRef.componentInstance.user = user;
    }

    private onDelete(user) {
        const modalRef = this.modalService.open(UserMgmtDeleteDialogComponent, { backdrop: 'static', size: 'lg' });
        modalRef.componentInstance.user = user;
    }
}
