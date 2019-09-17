import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { JhiAlertService, JhiOrderByPipe } from 'ng-jhipster';
import { filter, finalize } from 'rxjs/operators';

import { ITEMS_PER_PAGE } from '../../shared/constants/pagination.constants';
import { RoleMatrix, RoleMatrixPermission } from '../../shared/role/role.model';
import { RoleService } from '../../shared/role/role.service';
import { Principal } from '../../shared';

@Component({
    selector: 'xm-roles-matrix',
    templateUrl: './roles-matrix.component.html',
    providers: [JhiOrderByPipe],
    styleUrls: ['./roles-matrix.component.scss']
})
export class RolesMatrixComponent implements OnInit {

    @ViewChild('table', {static: false}) table: ElementRef;

    matrix: RoleMatrix;
    permissions: RoleMatrixPermission[];
    private permissionsSort: RoleMatrixPermission[];
    totalItems: any;
    queryCount: any;
    itemsPerPage: any;
    page: any = 1;
    previousPage: any;
    predicate: any = 'privilegeKey';
    reverse: any = true;
    showLoader: boolean;
    sortBy: any = {};
    entities: string[];
    hiddenRoles: any[] = [];
    checkAll: boolean[] = [];
    hasChanges: boolean;
    permitted_filter: any[] = [
        {},
        {trans: 'permitted', value: 'allset'},
        {trans: 'notPermitted', value: 'notset'},
        {trans: 'permittedAny', value: 'anyset'},
    ];
    private isSort: boolean;

    constructor(
        private principal: Principal,
        private roleService: RoleService,
        private alertService: JhiAlertService,
        private orderByPipe: JhiOrderByPipe,
    ) {
        this.itemsPerPage = ITEMS_PER_PAGE;
    }

    ngOnInit() {
        this.principal.identity().then(() => this.load());
    }

    load() {
        this.showLoader = true;
        this.roleService.getMatrix().subscribe(
                (result: RoleMatrix) => {
                    if (result.roles && result.roles.length && result.permissions && result.permissions.length) {
                        result.permissions.forEach(item => {
                            item.roles = item.roles || [];
                            item.roles = result.roles.map(el => {
                                const value = item.roles.indexOf(el) !== -1;
                                return {value: value, valueOrg: value};
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
                () => this.showLoader = false
            );
    }

    onLoadPage(page: number) {
        if (page !== this.previousPage) {
            this.previousPage = page;
            this.permissions = this.getItemsByPage(page);
            setTimeout(() => {
                this.hiddenRoles.forEach(role => {
                    this.table.nativeElement.querySelectorAll(`.col-${role.indx}`).forEach(el => el.classList.add('hidden'));
                });
            }, 10);
            // this.transition();
        }
    }

    onTransition(page: number) {
        if (this.isSort) {
            this.permissionsSort = this.orderByPipe.transform(this.permissionsSort, this.predicate, !this.reverse);
        } else {
            this.matrix.permissions = this.orderByPipe.transform(this.matrix.permissions, this.predicate, !this.reverse);
        }
        this.permissions = this.getItemsByPage(page);
        setTimeout(() => {
            this.hiddenRoles.forEach(role => {
                this.table.nativeElement.querySelectorAll(`.col-${role.indx}`).forEach(el => el.classList.add('hidden'));
            });
        }, 10);
    }

    onChangeSort() {
        console.log('sort');
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

    onChangePerPage() {
        this.previousPage = null;
        this.onLoadPage(this.page);
    }

    onHideRole(role: string, indx: number) {
        this.hiddenRoles.push({role, indx});
        this.table.nativeElement.querySelectorAll(`.col-${indx}`).forEach(el => el.classList.add('d-none'));
    }

    onViewRole(item) {
        this.hiddenRoles = this.hiddenRoles.filter(el => el.indx !== item.indx);
        this.table.nativeElement.querySelectorAll(`.col-${item.indx}`).forEach(el => el.classList.remove('d-none'));
    }

    onCheckAll(indx: number) {
        const check = this.checkAll[indx];
        (this.isSort ? this.permissionsSort : this.matrix.permissions).forEach(item => item.roles[indx].value = check);
    }

    onCancel() {
        this.matrix.permissions.forEach(item => item.roles.forEach(el => el.value = el.valueOrg));
        this.hasChanges = false;
    }

    onSave() {
        this.showLoader = true;
        const roles = this.matrix.roles;
        const matrix: RoleMatrix = Object.assign({}, this.matrix);
        matrix.permissions = matrix.permissions.map(perm => {
            const item = Object.assign({}, perm);
            item.roles = item.roles.reduce((result, el, pos) => {
                el.value && result.push(roles[pos]);
                return result;
            }, []);
            return item;
        });
        this.roleService.updateMatrix(matrix).pipe(finalize(() => this.showLoader = false))
            .subscribe(
                () => {
                    this.matrix.permissions.forEach(item => item.roles.forEach(el => el.valueOrg = el.value));
                    this.hasChanges = false;
                },
                (resp: Response) => {
                    this.onError(resp), this.showLoader = false
                },
                () => this.showLoader = false
            );
    }

    public isChanged(allItems) {
        this.hasChanges = false;
        allItems.forEach(e => {
            e.roles.forEach(r => {
                if (r.value !== r.valueOrg) {
                    this.hasChanges = true;
                }
            });
        });
    }

    private getItemsByPage(page) {
        const startPos = (page - 1) * this.itemsPerPage;
        const endPos = startPos + this.itemsPerPage;
        return (this.isSort ? this.permissionsSort : this.matrix.permissions).slice(startPos, endPos);
    }

    private getEntities(list: RoleMatrixPermission[] = []): string[] {
        return list.reduce((result, item) => {
            result.find(el => el === item.msName) || result.push(item.msName);
            return result;
        }, ['']).sort();
    }

    private groupByItem(list) {
        const sortBy = this.sortBy;
        return list.reduce((result: RoleMatrixPermission[], item: RoleMatrixPermission) => {
            const clearItemsbyRoles = item.roles.filter((x, y) => {
                if (!this.hiddenRoles.some(i => i.indx === y)) {
                    return x;
                }
            });
            const anySet = clearItemsbyRoles.some(x => x.value);
            const allSet = clearItemsbyRoles.every(x => x.value);
            if (
                (sortBy.msName && item.msName !== sortBy.msName) ||
                (sortBy.query && item.privilegeKey.indexOf(sortBy.query.toUpperCase()) === -1) ||
                (sortBy.permitted_filter === 'anyset' && anySet !== true) ||
                (sortBy.permitted_filter === 'notset' && anySet !== false) ||
                (sortBy.permitted_filter === 'allset' && allSet !== true)
            ) {
            } else {
                result.push(item);
            }
            return result;
        }, []);
    }

    private onError(resp) {
        try {
            const res = resp.body || {};
            this.alertService.error(res.error_description, res.params);
        } catch (e) {
        }
    }
}
