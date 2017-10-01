import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { UserService } from '../../shared';
import { UserModalService } from './user-modal.service';

@Component({
    selector: 'xm-user-mgmt-delete-dialog',
    templateUrl: './user-management-delete-dialog.component.html'
})
export class UserMgmtDeleteDialogComponent {

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private userService: UserService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.addLocation('user-management');
    }

    clear() {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete(userKey) {
        this.userService.delete(userKey).subscribe((response) => {
            this.eventManager.broadcast({ name: 'userListModification',
                content: 'Deleted a user'});
            this.activeModal.dismiss(true);
        });
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
