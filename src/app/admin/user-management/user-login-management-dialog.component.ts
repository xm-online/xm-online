import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { User } from '../../shared';

@Component({
    selector: 'xm-user-login-mgmt-dialog',
    templateUrl: './user-login-management-dialog.component.html',
})
export class UserLoginMgmtDialogComponent {

    @Input() public user: User;

    constructor(public activeModal: NgbActiveModal) {}

    public close(): void {
        this.activeModal.dismiss();
    }
}
