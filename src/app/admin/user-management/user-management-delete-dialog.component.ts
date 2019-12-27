import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { XM_EVENT_LIST } from '../../../app/xm.constants';

import { User, UserService } from '../../shared';

@Component({
    selector: 'xm-user-mgmt-delete-dialog',
    templateUrl: './user-management-delete-dialog.component.html',
})
export class UserMgmtDeleteDialogComponent {

    public showLoader: boolean;
    @Input() public user: User;

    constructor(
        private userService: UserService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
    ) {
    }

    public clear(): void {
        this.activeModal.dismiss('cancel');
    }

    public confirmDelete(userKey): void {
        this.showLoader = true;
        this.userService.delete(userKey)
            .subscribe((response) => {
                    this.eventManager.broadcast({
                        name: XM_EVENT_LIST.XM_USER_LIST_MODIFICATION,
                        content: {id: 'delete', msg: 'Deleted a user'},
                    });
                    this.activeModal.dismiss(true);
                    this.eventManager.broadcast({name: XM_EVENT_LIST.XM_USER_LIST_MODIFICATION, content: 'OK'});
                },
                (err) => console.log(err),
                () => this.showLoader = false);
    }

}
