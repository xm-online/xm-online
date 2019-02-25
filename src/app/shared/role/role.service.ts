import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { Role, RoleMatrix } from './role.model';

@Injectable()
export class RoleService {
    private resourceUrl = 'uaa/api/roles';

    constructor(private http: HttpClient,
                private dateUtils: JhiDateUtils) {
    }

    create(role: Role): Observable<any> {
        const copy: Role = Object.assign({}, role);
        copy.createdDate && (copy.createdDate = this.dateUtils.toDate(copy.createdDate));
        copy.updatedDate && (copy.updatedDate = this.dateUtils.toDate(copy.updatedDate));
        return this.http.post(this.resourceUrl, role);
    }

    update(role: Role): Observable<any> {
        const copy: Role = Object.assign({}, role);
        copy.createdDate && (copy.createdDate = this.dateUtils.toDate(copy.createdDate));
        copy.updatedDate && (copy.updatedDate = this.dateUtils.toDate(copy.updatedDate));
        return this.http.put(this.resourceUrl, role);
    }

    getRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(this.resourceUrl);
    }

    getRole(roleKey): Observable<Role> {
        return this.http.get<Role>(`${this.resourceUrl}/${roleKey}`);
    }

    delete(roleKey: string): Observable<any> {
        return this.http.delete(`${this.resourceUrl}/${roleKey}`);
    }

    getMatrix(): Observable<RoleMatrix> {
        return this.http.get<RoleMatrix>(`${this.resourceUrl}/matrix`);
    }

    updateMatrix(roleMatrix: RoleMatrix): Observable<RoleMatrix> {
        return this.http.put<RoleMatrix>(`${this.resourceUrl}/matrix`, roleMatrix);
    }
}
