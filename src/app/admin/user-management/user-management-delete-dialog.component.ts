import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';
import { User, UserService } from '../../shared';
import { UserModalService } from './user-modal.service';
import {XM_EVENT_LIST} from '../../../app/xm.constants';

@Component({
    selector: 'xm-user-mgmt-delete-dialog',
    templateUrl: './user-management-delete-dialog.component.html'
})
export class UserMgmtDeleteDialogComponent {

    showLoader: boolean;
    user: User;

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
                },
                (err) => console.log(err),
                () => this.showLoader = false);
    }

}

@Component({
    selector: 'xm-user-delete-dialog',
    template: ''
})
export class UserDeleteDialogComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor(
        private route: ActivatedRoute,
        private userModalService: UserModalService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe((params) => {
            this.modalRef = this.userModalService.open(UserMgmtDeleteDialogComponent, params['userKey']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
