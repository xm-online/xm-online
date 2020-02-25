import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiEventManager, JhiOrderByPipe } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { Principal } from '../../shared/auth/principal.service';
import { ITEMS_PER_PAGE } from '../../shared/constants/pagination.constants';
import { Role } from '../../shared/role/role.model';
import { RoleService } from '../../shared/role/role.service';
import { RoleMgmtDeleteDialogComponent } from './roles-management-delete-dialog.component';
import { RoleMgmtDialogComponent } from './roles-management-dialog.component';

@Component({
    selector: 'xm-roles-mgmt',
    templateUrl: './roles-management.component.html',
    providers: [JhiOrderByPipe],
})
export class RolesMgmtComponent implements OnInit, OnDestroy {

    public roles: Role[];
    public rolesAll: Role[];
    public totalItems: any;
    public queryCount: any;
    public itemsPerPage: any;
    public previousPage: any;
    public page: any = 1;
    public predicate: any = 'roleKey';
    public reverse: boolean = true;
    public showLoader: boolean;
    private eventSubscriber: Subscription;

    constructor(
        private roleService: RoleService,
        private alertService: XmToasterService,
        private principal: Principal,
        private eventManager: JhiEventManager,
        private orderByPipe: JhiOrderByPipe,
        private modalService: MatDialog,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
        this.registerChangeInRoles();
    }

    public ngOnInit(): void {
        this.principal.identity().then(() => {
            this.loadAll();
        });
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.eventSubscriber);
    }

    public loadAll(): void {
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
                () => this.showLoader = false,
            );
    }

    public onLoadPage(page: number): void {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.roles = this.getItemsByPage(page);
            // TODO:
            //  this.transition();
        }
    }

    public onTransition(): void {
        this.rolesAll = this.orderByPipe.transform(this.rolesAll, this.predicate, !this.reverse);
        this.roles = this.getItemsByPage(this.page);
    }

    public onChangePerPage(): void {
        this.previousPage = null;
        this.onLoadPage(this.page);
    }

    public onAdd(): void {
        this.modalService.open(RoleMgmtDialogComponent, {width: '500px'});
    }

    public onEdit(role: Role): void {
        const modalRef = this.modalService.open(RoleMgmtDialogComponent, {width: '500px'});
        modalRef.componentInstance.selectedRole = role;
    }

    public onDelete(role: Role): void {
        const modalRef = this.modalService.open(RoleMgmtDeleteDialogComponent, {width: '500px'});
        modalRef.componentInstance.selectedRole = role;
    }

    private registerChangeInRoles(): void {
        this.eventSubscriber = this.eventManager.subscribe('roleListModification', () => this.loadAll());
    }

    private getItemsByPage(page: number): Role[] {
        const startPos = (page - 1) * this.itemsPerPage;
        const endPos = startPos + this.itemsPerPage;
        return this.rolesAll.slice(startPos, endPos);
    }

    private onError(resp: any): void {
        try {
            const res = resp.body || {};
            this.alertService.error(res.error_description, res.params);
        } catch (e) {
            // empty block
        }
    }
}
