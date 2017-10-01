import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';

import { User, UserService } from '../../shared';
import {JhiLanguageHelper} from "../../shared/language/language.helper";
import {UserLogin} from "../../shared/user/login/user-login.model";
import {UserLoginService} from "../../shared/user/login/user-login.service";

@Component({
    selector: 'xm-user-mgmt-detail',
    templateUrl: './user-management-detail.component.html'
})
export class UserMgmtDetailComponent implements OnInit, OnDestroy {

    user: User;
    private routeData: any;
    private subscription: any;
    private routeDataSubscription: any;

    constructor(
        private jhiLanguageHelper: JhiLanguageHelper,
        private jhiLanguageService: JhiLanguageService,
        private userService: UserService,
        private userLoginService: UserLoginService,
        private route: ActivatedRoute
    ) {
        this.jhiLanguageService.addLocation('user-management');
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
        this.userService.find(userKey).subscribe((user) => {
            this.user = user;
            this.routeData.pageSubSubTitle = user.userKey;
            this.jhiLanguageHelper.updateTitle();
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.routeDataSubscription.unsubscribe();
    }

    getLogin(login: UserLogin) {
        return this.userLoginService.getLogin(login);
    }
}
