import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiEventManager } from 'ng-jhipster';

import { RoleService } from '../../shared/role/role.service';
import { Role } from '../../shared/role/role.model';

@Component({
    selector: 'xm-role-mgmt-dialog',
    templateUrl: './roles-management-dialog.component.html'
})
export class RoleMgmtDialogComponent implements OnInit {

    @Input() selectedRole: Role;
    role: Role;
    roles: string[];
    showLoader: Boolean;
    isAddMode: boolean;

    constructor(
        public activeModal: NgbActiveModal,
        private roleService: RoleService,
        private eventManager: JhiEventManager
    ) {
    }

    ngOnInit() {
        if (this.selectedRole) {
            this.role = new Role(this.selectedRole.roleKey, null, this.selectedRole.description);
        } else {
            this.role = new Role();
        }
        this.roleService.getRoles().subscribe(roles => {
            this.roles = roles.map(role => role.roleKey).sort();
            this.isAddMode = !this.role.roleKey;
        });
    }

    onClose() {
        this.activeModal.dismiss('cancel');
    }

    onSave() {
        this.showLoader = true;
        this.isAddMode || (this.role.createdDate = new Date().toJSON());
        this.role.updatedDate = new Date().toJSON();
        this.role.roleKey = this.role.roleKey.trim();
        this.role.description && (this.role.description = this.role.description.trim());
        this.roleService[this.isAddMode ? 'create' : 'update'](this.role)
            .subscribe((resp) => this.onSaveSuccess(resp),
                (err) => console.log(err),
                () => this.showLoader = false);
    }

    private onSaveSuccess(resp) {
        this.eventManager.broadcast({ name: 'roleListModification', content: 'OK' });
        this.activeModal.dismiss(resp);
    }
}
