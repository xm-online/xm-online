import {Component, OnInit} from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {JhiLanguageService} from "ng-jhipster";
import {Permission} from "../../shared/role/permission.model";

@Component({
    selector: 'xm-role-mgmt-condition-dialog',
    templateUrl: './roles-management-condition-dialog.component.html'
})
export class RoleConditionDialogComponent implements OnInit {

    condition: any;
    variables: string[];
    transInfo: string;
    permission: Permission;
    isAddMode: boolean;

    constructor(
        public activeModal: NgbActiveModal,
    ) {
    }

    ngOnInit() {
        this.isAddMode = !this.condition;
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    onSave() {
        this.activeModal.close(this.condition);
    }

}

