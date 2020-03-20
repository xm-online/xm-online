import { ComponentType } from '@angular/cdk/overlay';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiOrderByPipe } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { ITEMS_PER_PAGE } from '../../shared/constants/pagination.constants';
import { JhiLanguageHelper } from '@xm-ngx/components/language';
import { Permission } from '../../shared/role/permission.model';
import { Role } from '../../shared/role/role.model';
import { RoleService } from '../../shared/role/role.service';
import { RoleConditionDialogComponent } from './roles-management-condition-dialog.component';

@Component({
    selector: 'xm-role-mgmt-datail',
    templateUrl: './roles-management-detail.component.html',
    providers: [JhiOrderByPipe],
})
export class RoleMgmtDetailComponent implements OnInit, OnDestroy {

    public role: Role;
    public permissions: Permission[];
    public permissionsSort: Permission[];
    public totalItems: any;
    public queryCount: any;
    public itemsPerPage: typeof ITEMS_PER_PAGE = ITEMS_PER_PAGE;
    public previousPage: any;
    public page: any = 1;
    public predicate: any = 'privilegeKey';
    public reverse: boolean = true;
    public routeData: any;
    public forbids: string[] = ['', 'EXCEPTION', 'SKIP'];
    public permits: any[] = [
        {},
        {trans: 'permitted', value: true},
        {trans: 'notPermitted', value: false},
    ];
    public resourceConditions: any[] = [
        {},
        {trans: 'permitted', value: true},
        {trans: 'notPermitted', value: false},
    ];
    public showLoader: boolean;
    public sortBy: any = {};
    public hasEnv: boolean;
    public entities: string[];
    public checkAll: boolean;
    private isSort: boolean;
    private routeParamsSubscription: Subscription;
    private routeDataSubscription: Subscription;

    constructor(private jhiLanguageHelper: JhiLanguageHelper,
                private roleService: RoleService,
                private alertService: XmToasterService,
                private activatedRoute: ActivatedRoute,
                private orderByPipe: JhiOrderByPipe,
                private modalService: MatDialog) {
        this.routeDataSubscription = this.activatedRoute.data.subscribe((data) => this.routeData = data);
    }

    public ngOnInit(): void {
        this.routeParamsSubscription = this.activatedRoute.params.subscribe((params) => {
            const roleKey = params.roleKey;
            if (roleKey) {
                this.routeData.pageSubSubTitle = roleKey;
                this.load(roleKey);
                this.jhiLanguageHelper.updateTitle();
            }
        });
    }

    public ngOnDestroy(): void {
        this.routeParamsSubscription.unsubscribe();
        this.routeDataSubscription.unsubscribe();
    }

    public load(roleKey: string): void {
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
                () => this.showLoader = false,
            );
    }

    public onLoadPage(page: number): void {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.permissions = this.getItemsByPage(page);
            // TODO:
            //  this.transition();
        }
    }

    public onTransition(page: number): void {
        if (this.isSort) {
            this.permissionsSort = this.orderByPipe.transform(this.permissionsSort, this.predicate, !this.reverse);
        } else {
            this.role.permissions = this.orderByPipe.transform(this.role.permissions, this.predicate, !this.reverse);
        }
        this.permissions = this.getItemsByPage(page);
    }

    public onChangeSort(): void {
        const booleanCompare = (obj) => typeof obj === 'boolean';
        if (this.sortBy.msName || this.sortBy.query
            || booleanCompare(this.sortBy.enabled)
            || booleanCompare(this.sortBy.condition)) {
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

    public onChangePerPage(): void {
        this.previousPage = null;
        this.onLoadPage(this.page);
    }

    public onCheckAll(): void {
        (this.isSort ? this.permissionsSort : this.role.permissions).forEach((el) => el.enabled = this.checkAll);
    }

    public onEditResource(item: Permission): void {
        this.openDialog(RoleConditionDialogComponent, item, item.resourceCondition,
            item.resources, 'rolesManagement.permission.conditionResourceInfo').afterClosed().subscribe(
            (result) => {
                item.resourceCondition = result || '';
            });
    }

    public onEditEnv(item: Permission): void {
        this.openDialog(RoleConditionDialogComponent, item, item.envCondition, this.role.env,
            'rolesManagement.permission.conditionEnvInfo').afterClosed().subscribe((result) => {
            item.envCondition = result || '';
        });
    }

    public onSave(): void {
        this.showLoader = true;
        this.role.updatedDate = new Date().toJSON();
        this.roleService.update(this.role)
            .subscribe((resp: Response) => this.onError(resp),
                (err) => console.warn(err),
                () => this.showLoader = false);
    }

    private getItemsByPage(page: any): Permission[] {
        const startPos = (page - 1) * this.itemsPerPage;
        const endPos = startPos + this.itemsPerPage;
        return (this.isSort ? this.permissionsSort : this.role.permissions).slice(startPos, endPos);
    }

    private getEntities(list: Permission[] = []): string[] {
        return list.reduce((result, item) => {
            if (!result.find((el) => el === item.msName)) {
                result.push(item.msName);
            }
            return result;
        }, ['']).sort();
    }

    private groupByItem(list: any): any {
        const sortBy = this.sortBy;
        return list.reduce((result: Permission[], item: Permission) => {
            const resourceCondition = typeof item.resourceCondition !== 'object';
            if (
                (sortBy.msName && item.msName !== sortBy.msName) ||
                (typeof sortBy.enabled === 'boolean' && item.enabled !== sortBy.enabled) ||
                (typeof sortBy.condition === 'boolean' && resourceCondition !== sortBy.condition) ||
                // eslint-disable-next-line @typescript-eslint/prefer-includes
                (sortBy.query && item.privilegeKey.indexOf(sortBy.query.toUpperCase()) === -1)
            ) {
                // empty block
            } else {
                result.push(item);
            }
            return result;
        }, []);
    }

    private onError(resp: any): void {
        try {
            const res = resp.json() || {};
            this.alertService.error(res.error_description, res.params);
        } catch (e) {
            // empty block
        }
    }

    private openDialog(
        component: ComponentType<RoleConditionDialogComponent>,
        perm: Permission,
        condition: string,
        variables: string[],
        transInfo: string,
    ): MatDialogRef<any> {
        const modalRef = this.modalService.open(component, {width: '500px'});
        modalRef.componentInstance.condition = condition;
        modalRef.componentInstance.variables = variables;
        modalRef.componentInstance.transInfo = transInfo;
        modalRef.componentInstance.permission = perm;
        return modalRef;
    }

}
