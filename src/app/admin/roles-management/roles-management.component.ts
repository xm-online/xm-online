import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiAlertService, JhiEventManager, JhiOrderByPipe } from 'ng-jhipster';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { Principal } from '../../shared/auth/principal.service';
import { ITEMS_PER_PAGE } from '../../shared/constants/pagination.constants';
import { Role } from '../../shared/role/role.model';
import { RoleService } from '../../shared/role/role.service';
import { RoleMgmtDialogComponent} from './roles-management-dialog.component';
import { RoleMgmtDeleteDialogComponent} from './roles-management-delete-dialog.component';

@Component({
    selector: 'xm-roles-mgmt',
    templateUrl: './roles-management.component.html',
    providers: [JhiOrderByPipe]
})
export class RolesMgmtComponent implements OnInit, OnDestroy {

    roles: Role[];
    rolesAll: Role[];
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    previousPage: any;
    page: any = 1;
    predicate: any = 'roleKey';
    reverse: any = true;
    showLoader: boolean;
    private eventSubscriber: Subscription;

    constructor(
        private roleService: RoleService,
        private alertService: JhiAlertService,
        private principal: Principal,
        private eventManager: JhiEventManager,
        private orderByPipe: JhiOrderByPipe,
        private modalService: NgbModal,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.registerChangeInRoles();
    }


    ngOnInit() {
        this.principal.identity().then(() => {
            this.loadAll();
        });
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    private registerChangeInRoles() {
        this.eventSubscriber = this.eventManager.subscribe('roleListModification', () => this.loadAll());
    }

    loadAll() {
        this.showLoader = true;
        this.roleService.getRoles()
            .subscribe(
                (result) => {
                    this.rolesAll = this.orderByPipe.transform(result, this.predicate, !this.reverse);
                    this.queryCount = this.totalItems = result.length;
                    if (this.page > 1) {
                        const length = parseInt(this.queryCount / this.itemsPerPage + '', 10)
                            + (this.queryCount % this.itemsPerPage ? 1 : 0);
                        if (this.page > length) {
                            this.page = length;
                            this.previousPage = null;
                        }
                    }
                    this.roles = this.getItemsByPage(this.page);
                },
                (res: Response) => this.onError(res),
                () => this.showLoader = false
            );
    }

    onLoadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.roles = this.getItemsByPage(page);
            // this.transition();
        }
    }

    onTransition() {
        this.rolesAll = this.orderByPipe.transform(this.rolesAll, this.predicate, !this.reverse);
        this.roles = this.getItemsByPage(this.page);
    }

    onChangePerPage() {
        this.previousPage = null;
        this.onLoadPage(this.page);
    }

    private getItemsByPage(page: number): Role[] {
        const startPos = (page - 1) * this.itemsPerPage;
        const endPos = startPos + this.itemsPerPage;
        return this.rolesAll.slice(startPos, endPos);
    }

    private onError(resp) {
        try {
            const res = resp.body || {};
            this.alertService.error(res.error_description, res.params)
        } catch (e) {
        }
    }

    public onAdd() {
        this.modalService.open(RoleMgmtDialogComponent, { backdrop: 'static' });
    }

    public onEdit(role) {
        const modalRef = this.modalService.open(RoleMgmtDialogComponent, { backdrop: 'static' });
        modalRef.componentInstance.selectedRole = role;
    }

    public onDelete(role) {
        const modalRef = this.modalService.open(RoleMgmtDeleteDialogComponent, { backdrop: 'static' });
        modalRef.componentInstance.selectedRole = role;
    }
}
