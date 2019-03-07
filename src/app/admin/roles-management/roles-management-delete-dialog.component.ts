import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {JhiAlertService, JhiEventManager} from 'ng-jhipster';

import { RoleService } from '../../shared';
import { Role } from '../../shared/role/role.model';

@Component({
    selector: 'xm-role-mgmt-delete-dialog',
    templateUrl: './roles-management-delete-dialog.component.html'
})
export class RoleMgmtDeleteDialogComponent implements OnInit {

    @Input() selectedRole: Role;
    role: Role;
    showLoader: boolean;

    constructor(
        private roleService: RoleService,
        public activeModal: NgbActiveModal,
        private eventManager: JhiEventManager,
        private alertService: JhiAlertService,
    ) {
    }

    ngOnInit() {
        if (this.selectedRole) {
            this.role = new Role(this.selectedRole.roleKey)
        }
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    onConfirmDelete(roleKey) {
        this.showLoader = true;
        this.roleService.delete(roleKey)
            .subscribe(
                (resp) => {
                    this.eventManager.broadcast({ name: 'roleListModification', content: 'Deleted a role'});
                    this.activeModal.dismiss(true);
                }, resp => {
                    try {
                        const res = resp.json() || {};
                        this.alertService.error(res.error_description, res.params)
                    } catch (e) {}
                },
                () => this.showLoader = false
            );
    }
}
