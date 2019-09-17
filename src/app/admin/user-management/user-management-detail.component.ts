import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { User, UserService } from '../../shared';
import {JhiLanguageHelper} from '../../shared/language/language.helper';
import {UserLogin} from '../../shared/user/login/user-login.model';
import {UserLoginService} from '../../shared/user/login/user-login.service';
import {PasswordResetInit} from '../../account/password-reset/init/password-reset-init.service';
import swal from 'sweetalert2';
import { Location } from '@angular/common';

@Component({
    selector: 'xm-user-mgmt-detail',
    templateUrl: './user-management-detail.component.html'
})
export class UserMgmtDetailComponent implements OnInit, OnDestroy {

    user: User;
    showLoader: boolean;
    private routeData: any;
    private subscription: any;
    private routeDataSubscription: any;
    public userEmail: string;

    constructor(
        private jhiLanguageHelper: JhiLanguageHelper,
        private userService: UserService,
        private userLoginService: UserLoginService,
        private pwsResetService: PasswordResetInit,
        private route: ActivatedRoute,
        private location: Location
    ) {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.routeData = data;
        });
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['userKey']);
        });
    }

    load(userKey) {
        this.showLoader = true;
        this.userService
            .find(userKey)
            .subscribe((user) => {
                    this.user = user;
                    this.userEmail = this.getEmail();
                    this.routeData.pageSubSubTitle = user.userKey;
                    this.jhiLanguageHelper.updateTitle();
                },
                (err) => console.log(err),
                () => this.showLoader = false);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.routeDataSubscription.unsubscribe();
    }

    getLogin(login: UserLogin) {
        return this.userLoginService.getLogin(login);
    }

    onBack() {
        this.location.back();
    }

    public initPasswordReset() {
        swal({
            title: `Initiate password reset for ${this.userEmail}?`,
            showCancelButton: true,
            buttonsStyling: false,
            confirmButtonClass: 'btn mat-raised-button btn-primary',
            cancelButtonClass: 'btn mat-raised-button',
            confirmButtonText: 'Yes, reset!'
        }).then((result) => result.value ?
            this.pwsResetService.save(this.userEmail).subscribe(console.log, console.log) :
            console.log('Cancel'))
    }

    private getEmail(): string {
        let email = '';
        if (this.user.logins) {
            this.user.logins.forEach((item: UserLogin) => {if ('LOGIN.EMAIL' === item.typeKey) {
                email = item.login;
            }});
        }
        return email;
    }

    public pwdResetDisabled(): boolean {
        return !this.user.activated;
    }

}
