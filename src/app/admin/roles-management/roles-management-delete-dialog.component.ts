import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { XmToasterService } from '@xm-ngx/toaster';

import { JhiEventManager } from 'ng-jhipster';

import { RoleService } from '../../shared';
import { Role } from '../../shared/role/role.model';

@Component({
    selector: 'xm-role-mgmt-delete-dialog',
    templateUrl: './roles-management-delete-dialog.component.html',
})
export class RoleMgmtDeleteDialogComponent implements OnInit {

    @Input() public selectedRole: Role;
    public role: Role;
    public showLoader: boolean;

    constructor(
        private roleService: RoleService,
        public activeModal: MatDialogRef<RoleMgmtDeleteDialogComponent>,
        private eventManager: JhiEventManager,
        private alertService: XmToasterService,
    ) {
    }

    public ngOnInit(): void {
        if (this.selectedRole) {
            this.role = {roleKey: this.selectedRole.roleKey};
        }
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    public onConfirmDelete(roleKey: string): void {
        this.showLoader = true;
        this.roleService.delete(roleKey)
            .subscribe(
                () => {
                    this.eventManager.broadcast({name: 'roleListModification', content: 'Deleted a role'});
                    this.activeModal.close(true);
                }, (resp) => {
                    try {
                        const res = resp.json() || {};
                        this.alertService.error(res.error_description, res.params);
                    } catch (e) {
                        // empty block
                    }
                },
                () => this.showLoader = false,
            );
    }
}
