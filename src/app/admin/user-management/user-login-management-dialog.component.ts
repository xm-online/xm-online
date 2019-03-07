import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { UserModalService } from './user-modal.service';
import { User } from '../../shared';

@Component({
    selector: 'xm-user-login-mgmt-dialog',
    templateUrl: './user-login-management-dialog.component.html'
})
export class UserLoginMgmtDialogComponent implements OnInit {

    user: User;

    constructor(
    ) {}

    ngOnInit() {
    }

    clear() {
    }
}

@Component({
    selector: 'xm-user-login-dialog',
    template: ''
})
export class UserLoginDialogComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private userModalService: UserModalService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            if ( params['userKey'] ) {
                this.modalRef = this.userModalService.open(UserLoginMgmtDialogComponent, params['userKey']);
            }
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
