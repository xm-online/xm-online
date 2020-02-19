import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { matExpansionAnimations } from '@angular/material';
import { ActivationEnd, Router } from '@angular/router';
import * as _ from 'lodash';
import { combineLatest, Observable, Subscription } from 'rxjs';
import { filter, map, share, tap } from 'rxjs/operators';
import { AccountService, User } from '../../../shared';
import { MenuItem } from '../menu/menu-models';

interface UserOptions {
    username: string;
    avatarUrl: string;
    menu: MenuItem[];
}

const USER_MENU: MenuItem[] = [
    {
        position: 1,
        permission: 'ACCOUNT.GET_LIST.ITEM',
        url: ['settings'],
        icon: 'settings',
        title: 'global.menu.account.settings',
    },
    {
        position: 2,
        permission: 'ACCOUNT.PASSWORD.UPDATE',
        url: ['password'],
        icon: 'lock',
        title: 'global.menu.account.password',
    },
];

const LOGOUT_CONTROL: MenuItem = {
    position: 3,
    url: ['logout'],
    icon: 'logout',
    title: 'global.menu.account.logout',
}

const DEFAULT: UserOptions = {
    username: '',
    avatarUrl: './assets/img/anonymous.png',
    menu: USER_MENU,
};

function getUserName(user: User): string {
    if (user.firstName || user.lastName) {
        return `${user.firstName || ''} ${user.lastName || ''}`;
    } else {
        return user.logins[0].login;
    }
}

function userToOptions(user: User): UserOptions {
    const opts: UserOptions = {
        username: getUserName(user),
        avatarUrl: user.imageUrl || undefined,
        menu: undefined,
    };

    return _.defaults(opts, DEFAULT);
}

@Component({
    selector: 'xm-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
    animations: [
        matExpansionAnimations.bodyExpansion,
        matExpansionAnimations.indicatorRotate,
    ],
})
export class UserComponent implements OnInit {
    public logoutControl: MenuItem = LOGOUT_CONTROL;
    public user$: Observable<UserOptions>;
    public active: boolean = false;
    protected subscriptions: Subscription[] = [];

    constructor(protected readonly accountService: AccountService,
                protected readonly router: Router,
    ) { }

    public ngOnInit(): void {
        this.user$ = this.accountService.get().pipe(
            map((i) => i.body),
            map(userToOptions),
            share(),
        );

        this.subscriptions.push(combineLatest([
            this.user$,
            this.router.events.pipe(filter((e) => e instanceof ActivationEnd)),
        ]).pipe(
            map((i) => i[0]),
            tap(this.selectActive.bind(this)),
        ).subscribe());
    }

    public getState(): string {
        return this.active ? 'expanded' : 'collapsed';
    }

    public toggle(): void {
        this.active = !this.active;
    }

    public selectActive(options: UserOptions): void {

        _.forEach(options.menu, (menu) => {
            if (this.router.isActive(menu.url.join('/'), false)) {
                this.active = true;
                return false;
            }
            return true;
        });

    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((i) => i.unsubscribe());
    }
}
