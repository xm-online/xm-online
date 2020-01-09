import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../shared';
import { XmEntitySpecWrapperService } from '../../xm-entity';

@Component({
    selector: 'xm-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {

    constructor(protected readonly loginService: LoginService,
                protected readonly xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                protected readonly router: Router) { }

    public ngOnInit(): void {
        this.logout();
    }

    public logout(): void {
        this.loginService.logout();
        this.xmEntitySpecWrapperService.clear();
        this.router.navigate(['']);
        /** TODO: transform below as a listener of auth state */
        const body = document.querySelector('body');
        /** TODO: mobile view backdrop form the sidebar not hidden */
        body.classList.remove('nav-open');
        body.classList.add('xm-public-screen');
    }

}
