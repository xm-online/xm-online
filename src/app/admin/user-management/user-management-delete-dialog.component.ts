import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { User, UserService } from '../../shared';
import { XM_EVENT_LIST } from '../../../app/xm.constants';

@Component({
    selector: 'xm-user-mgmt-delete-dialog',
    templateUrl: './user-management-delete-dialog.component.html'
})
export class UserMgmtDeleteDialogComponent {

    showLoader: boolean;
    @Input() user: User;

    constructor(
        private userService: UserService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager
    ) {
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(userKey) {
        this.showLoader = true;
        this.userService.delete(userKey)
            .subscribe((response) => {
                    this.eventManager.broadcast({
                        name: XM_EVENT_LIST.XM_USER_LIST_MODIFICATION,
                        content: {id: 'delete', msg: 'Deleted a user'}
                    });
                    this.activeModal.dismiss(true);
                    this.eventManager.broadcast({ name: XM_EVENT_LIST.XM_USER_LIST_MODIFICATION, content: 'OK' });
                },
                (err) => console.log(err),
                () => this.showLoader = false);
    }

}
