import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiOrderByPipe } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { ITEMS_PER_PAGE } from '../../shared/constants/pagination.constants';
import { JhiLanguageHelper } from '../../shared/language/language.helper';
import { Permission } from '../../shared/role/permission.model';
import { Role } from '../../shared/role/role.model';
import { RoleService } from '../../shared/role/role.service';
import { RoleConditionDialogComponent } from './roles-management-condition-dialog.component';

@Component({
    selector: 'xm-role-mgmt-datail',
    templateUrl: './roles-management-detail.component.html',
    providers: [JhiOrderByPipe]
})
export class RoleMgmtDetailComponent implements OnInit, OnDestroy {

    role: Role;
    permissions: Permission[];
    permissionsSort: Permission[];
    totalItems: any;
    queryCount: any;
    itemsPerPage = ITEMS_PER_PAGE;
    previousPage: any;
    page: any = 1;
    predicate: any = 'privilegeKey';
    reverse: any = true;
    routeData: any;
    forbids: string[] = ['', 'EXCEPTION', 'SKIP'];
    permits: any[] = [
        {},
        {trans: 'permitted', value: true},
        {trans: 'notPermitted', value: false}
    ];
    resource_conditions: any[] = [
        {},
        {trans: 'permitted', value: true},
        {trans: 'notPermitted', value: false}
    ];
    showLoader: boolean;
    sortBy: any = {};
    hasEnv: boolean;
    entities: string[];
    checkAll: boolean;
    private isSort: boolean;
    private routeParamsSubscription: Subscription;
    private routeDataSubscription: Subscription;

    constructor(private jhiLanguageHelper: JhiLanguageHelper,
                private roleService: RoleService,
                private alertService: JhiAlertService,
                private activatedRoute: ActivatedRoute,
                private orderByPipe: JhiOrderByPipe,
                private modalService: NgbModal) {
        this.routeDataSubscription = this.activatedRoute.data.subscribe(data => this.routeData = data);
    }

    ngOnInit() {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe((params) => {
            const roleKey = params['roleKey'];
            if (roleKey) {
                this.routeData.pageSubSubTitle = roleKey;
                this.load(roleKey);
                this.jhiLanguageHelper.updateTitle();
            }
        });
    }

    ngOnDestroy() {
        this.routeParamsSubscription.unsubscribe();
        this.routeDataSubscription.unsubscribe();
    }

    load(roleKey: string) {
        this.showLoader = true;
        this.roleService.getRole(roleKey)
            .subscribe(
                (result: Role) => {
                    result.permissions = result.permissions || [];
                    this.role = result;
                    this.hasEnv = !!(result.env && result.env.length);
                    this.entities = this.getEntities(result.permissions);
                    this.queryCount = this.totalItems = result.permissions.length;
                    this.onTransition(this.page);
                },
                (resp: Response) => this.onError(resp),
                () => this.showLoader = false
            );
    }

    onLoadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.permissions = this.getItemsByPage(page);
            // this.transition();
        }
    }

    onTransition(page: number) {
        if (this.isSort) {
            this.permissionsSort = this.orderByPipe.transform(this.permissionsSort, this.predicate, !this.reverse);
        } else {
            this.role.permissions = this.orderByPipe.transform(this.role.permissions, this.predicate, !this.reverse);
        }
        this.permissions = this.getItemsByPage(page);
    }

    onChangeSort() {
        const booleanCompare = (obj) => typeof obj === 'boolean';
        if (this.sortBy.msName || this.sortBy.query || booleanCompare(this.sortBy.enabled) || booleanCompare(this.sortBy.condition)) {
            this.isSort = true;
            this.permissionsSort = this.groupByItem(this.role.permissions);
            this.queryCount = this.totalItems = this.permissionsSort.length;
        } else {
            this.isSort = false;
            this.queryCount = this.totalItems = this.role.permissions.length;
        }
        this.page = 1;
        this.onTransition(this.page);
    }

    onChangePerPage() {
        this.previousPage = null;
        this.onLoadPage(this.page);
    }

    onCheckAll() {
        (this.isSort ? this.permissionsSort : this.role.permissions).forEach(el => el.enabled = this.checkAll);
    }

    onEditResource(item: Permission) {
        this.openDialog(RoleConditionDialogComponent, item, item.resourceCondition, item.resources, 'rolesManagement.permission.conditionResourceInfo').result
            .then(result => {
                item.resourceCondition = result || '';
            }, () => {
            });
    }

    onEditEnv(item: Permission) {
        this.openDialog(RoleConditionDialogComponent, item, item.envCondition, this.role.env, 'rolesManagement.permission.conditionEnvInfo').result
            .then(result => {
                item.envCondition = result || '';
            }, () => {
            });
    }

    onSave() {
        this.showLoader = true;
        this.role.updatedDate = new Date().toJSON();
        this.roleService.update(this.role)
            .subscribe((resp: Response) => this.onError(resp),
                (err) => console.log(err),
                () => this.showLoader = false);
    }

    private getItemsByPage(page) {
        const startPos = (page - 1) * this.itemsPerPage,
            endPos = startPos + this.itemsPerPage
        ;
        return (this.isSort ? this.permissionsSort : this.role.permissions).slice(startPos, endPos);
    }

    private getEntities(list: Permission[] = []): string[] {
        return list.reduce((result, item) => {
            result.find(el => el === item.msName) || result.push(item.msName);
            return result;
        }, ['']).sort();
    }

    private groupByItem(list) {
        const sortBy = this.sortBy;
        return list.reduce((result: Permission[], item: Permission) => {
            const resourceCondition = typeof item.resourceCondition !== 'object'
            if (
                (sortBy.msName && item.msName !== sortBy.msName) ||
                (typeof sortBy.enabled === 'boolean' && item.enabled !== sortBy.enabled) ||
                (typeof sortBy.condition === 'boolean' && resourceCondition !== sortBy.condition) ||
                (sortBy.query && item.privilegeKey.indexOf(sortBy.query.toUpperCase()) === -1)
            ) {
            } else {

                result.push(item);
            }
            return result;
        }, []);
    }

    private onError(resp) {
        try {
            const res = resp.json() || {};
            this.alertService.error(res.error_description, res.params);
        } catch (e) {
        }
    }

    private openDialog(component: any, perm: Permission, condition: string, variables: string[], transInfo: string): NgbModalRef {
        const modalRef = this.modalService.open(component, {backdrop: 'static'});
        modalRef.componentInstance.condition = condition;
        modalRef.componentInstance.variables = variables;
        modalRef.componentInstance.transInfo = transInfo;
        modalRef.componentInstance.permission = perm;
        return modalRef;
    }

}


