import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiOrderByPipe } from 'ng-jhipster';
import { finalize } from 'rxjs/operators';
import { Principal } from '../../shared';

import { ITEMS_PER_PAGE } from '../../shared/constants/pagination.constants';
import { RoleMatrix, RoleMatrixPermission } from '../../shared/role/role.model';
import { RoleService } from '../../shared/role/role.service';

@Component({
    selector: 'xm-roles-matrix',
    templateUrl: './roles-matrix.component.html',
    providers: [JhiOrderByPipe],
    styleUrls: ['./roles-matrix.component.scss'],
})
export class RolesMatrixComponent implements OnInit {

    @ViewChild('table', {static: false}) public table: ElementRef;

    public matrix: RoleMatrix;
    public permissions: RoleMatrixPermission[];
    public totalItems: any;
    public queryCount: any;
    public itemsPerPage: any;
    public page: any = 1;
    public previousPage: any;
    public predicate: any = 'privilegeKey';
    public reverse: boolean = true;
    public showLoader: boolean;
    public sortBy: any = {};
    public entities: string[];
    public hiddenRoles: any[] = [];
    public checkAll: boolean[] = [];
    public hasChanges: boolean;
    public permittedFilter: any[] = [
        {},
        {trans: 'permitted', value: 'allset'},
        {trans: 'notPermitted', value: 'notset'},
        {trans: 'permittedAny', value: 'anyset'},
    ];
    private permissionsSort: RoleMatrixPermission[];
    private isSort: boolean;

    constructor(
        private principal: Principal,
        private roleService: RoleService,
        private alertService: XmToasterService,
        private orderByPipe: JhiOrderByPipe,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
    }

    public ngOnInit(): void {
        this.principal.identity().then(() => this.load());
    }

    public load(): void {
        this.showLoader = true;
        this.roleService.getMatrix().subscribe(
            (result: RoleMatrix) => {
                if (result.roles && result.roles.length && result.permissions && result.permissions.length) {
                    result.permissions.forEach((item) => {
                        item.roles = item.roles || [];
                        item.roles = result.roles.map((el) => {
                            // eslint-disable-next-line @typescript-eslint/prefer-includes
                            const value = item.roles.indexOf(el) !== -1;
                            return {value, valueOrg: value};
                        });
                    });
                    result.permissions = this.orderByPipe.transform(result.permissions, this.predicate, !this.reverse);
                }
                this.matrix = result;
                this.entities = this.getEntities(result.permissions);
                this.queryCount = this.totalItems = result.permissions.length;
                this.permissions = this.getItemsByPage(this.page);
            },
            (resp) => this.onError(resp),
            () => this.showLoader = false,
        );
    }

    public onLoadPage(page: number): void {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.permissions = this.getItemsByPage(page);
            this.setTime();
            // TODO:
            //  this.transition();
        }
    }

    public setTime(): void {
        setTimeout(() => {
            this.hiddenRoles.forEach((role) => {
                this.table.nativeElement.querySelectorAll(`.col-${role.indx}`)
                    .forEach((el) => el.classList.add('hidden'));
            });
        }, 10);
    }

    public onTransition(page: number): void {
        if (this.isSort) {
            this.permissionsSort = this.orderByPipe.transform(this.permissionsSort, this.predicate, !this.reverse);
        } else {
            this.matrix.permissions = this.orderByPipe.transform(this.matrix.permissions,
                this.predicate, !this.reverse);
        }
        this.permissions = this.getItemsByPage(page);
        this.setTime();
    }

    public onChangeSort(): void {
        console.info('sort');
        if (this.sortBy.msName || this.sortBy.query || this.sortBy.permitted_filter) {
            this.isSort = true;
            this.permissionsSort = this.groupByItem(this.matrix.permissions);
            this.queryCount = this.totalItems = this.permissionsSort.length;
        } else {
            this.isSort = false;
            this.queryCount = this.totalItems = this.matrix.permissions.length;
        }
        this.page = 1;
        this.onTransition(this.page);
    }

    public onChangePerPage(): void {
        this.previousPage = null;
        this.onLoadPage(this.page);
    }

    public onHideRole(role: string, indx: number): void {
        this.hiddenRoles.push({role, indx});
        this.table.nativeElement.querySelectorAll(`.col-${indx}`).forEach((el) => el.classList.add('d-none'));
    }

    public onViewRole(item: any): void {
        this.hiddenRoles = this.hiddenRoles.filter((el) => el.indx !== item.indx);
        this.table.nativeElement.querySelectorAll(`.col-${item.indx}`).forEach((el) => el.classList.remove('d-none'));
    }

    public onCheckAll(indx: number): void {
        const check = this.checkAll[indx];
        (this.isSort ? this.permissionsSort : this.matrix.permissions)
            .forEach((item) => item.roles[indx].value = check);
    }

    public onCancel(): void {
        this.matrix.permissions.forEach((item) => item.roles.forEach((el) => el.value = el.valueOrg));
        this.hasChanges = false;
    }

    public onSave(): void {
        this.showLoader = true;
        const roles = this.matrix.roles;
        const matrix: RoleMatrix = Object.assign({}, this.matrix);
        matrix.permissions = matrix.permissions.map((perm) => {
            const item = Object.assign({}, perm);
            item.roles = item.roles.reduce((result, el, pos) => {
                if (el.value) {
                    result.push(roles[pos]);
                }
                return result;
            }, []);
            return item;
        });
        this.roleService.updateMatrix(matrix).pipe(finalize(() => this.showLoader = false))
            .subscribe(
                () => {
                    this.matrix.permissions.forEach((item) => item.roles.forEach((el) => el.valueOrg = el.value));
                    this.hasChanges = false;
                },
                (resp: Response) => {
                    this.onError(resp);
                    this.showLoader = false;
                },
                () => this.showLoader = false,
            );
    }

    public isChanged(allItems: any): void {
        this.hasChanges = false;
        allItems.forEach((e) => {
            e.roles.forEach((r) => {
                if (r.value !== r.valueOrg) {
                    this.hasChanges = true;
                }
            });
        });
    }

    private getItemsByPage(page: any): RoleMatrixPermission[] {
        const startPos = (page - 1) * this.itemsPerPage;
        const endPos = startPos + this.itemsPerPage;
        return (this.isSort ? this.permissionsSort : this.matrix.permissions).slice(startPos, endPos);
    }

    private getEntities(list: RoleMatrixPermission[] = []): string[] {
        return list.reduce((result, item) => {
            if (!result.find((el) => el === item.msName)) {
                result.push(item.msName);
            }
            return result;
        }, ['']).sort();
    }

    private groupByItem(list: any): any {
        const sortBy = this.sortBy;
        return list.reduce((result: RoleMatrixPermission[], item: RoleMatrixPermission) => {
            const clearItemsbyRoles = item.roles.filter((x, y) => {
                if (!this.hiddenRoles.some((i) => i.indx === y)) {
                    return x;
                }
            });
            const anySet = clearItemsbyRoles.some((x) => x.value);
            const allSet = clearItemsbyRoles.every((x) => x.value);
            if (
                (sortBy.msName && item.msName !== sortBy.msName) ||
                // eslint-disable-next-line @typescript-eslint/prefer-includes
                (sortBy.query && item.privilegeKey.indexOf(sortBy.query.toUpperCase()) === -1) ||
                (sortBy.permitted_filter === 'anyset' && anySet !== true) ||
                (sortBy.permitted_filter === 'notset' && anySet !== false) ||
                (sortBy.permitted_filter === 'allset' && allSet !== true)
            ) {
                // empty block
            }
            else {
                result.push(item);
            }
            return result;
        }, []);
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
