import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { XmEventManager } from '@xm-ngx/core';
import { Role } from '../../shared/role/role.model';

import { RoleService } from '../../shared/role/role.service';

@Component({
    selector: 'xm-role-mgmt-dialog',
    templateUrl: './roles-management-dialog.component.html',
})
export class RoleMgmtDialogComponent implements OnInit {

    @Input() public selectedRole: Role;
    public role: Role;
    public roles: string[];
    public showLoader: boolean;
    public isAddMode: boolean;

    constructor(
        public activeModal: MatDialogRef<RoleMgmtDialogComponent>,
        private roleService: RoleService,
        private eventManager: XmEventManager,
    ) {
    }

    public ngOnInit(): void {
        if (this.selectedRole) {
            this.role = {roleKey: this.selectedRole.roleKey, basedOn: null, description: this.selectedRole.description};
        } else {
            this.role = {};
        }
        this.roleService.getRoles().subscribe((roles) => {
            this.roles = roles.map((role) => role.roleKey).sort();
            this.isAddMode = !this.role.roleKey;
        });
    }

    public onClose(): void {
        this.activeModal.close(false);
    }

    public onSave(): void {
        this.showLoader = true;
        if (!this.isAddMode) {
            (this.role.createdDate = new Date().toJSON());
        }

        this.role.updatedDate = new Date().toJSON();
        this.role.roleKey = this.role.roleKey.trim();
        if (this.role.description) {
            (this.role.description = this.role.description.trim());
        }
        this.roleService[this.isAddMode ? 'create' : 'update'](this.role)
            .subscribe((resp) => this.onSaveSuccess(resp),
                (err) => console.info(err),
                () => this.showLoader = false);
    }

    private onSaveSuccess(resp: any): void {
        this.eventManager.broadcast({name: 'roleListModification', content: 'OK'});
        this.activeModal.close(resp);
    }
}
