import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs';

import { Role, RoleMatrix } from './role.model';

@Injectable()
export class RoleService {
    private resourceUrl: string = 'uaa/api/roles';

    constructor(private http: HttpClient,
                private dateUtils: JhiDateUtils) {
    }

    public create(role: Role): Observable<any> {
        const copy: Role = Object.assign({}, role);
        if (copy.createdDate) {copy.createdDate = this.dateUtils.toDate(copy.createdDate); }
        if (copy.updatedDate) {copy.updatedDate = this.dateUtils.toDate(copy.updatedDate); }
        return this.http.post(this.resourceUrl, role);
    }

    public update(role: Role): Observable<any> {
        const copy: Role = Object.assign({}, role);
        if (copy.createdDate) {copy.createdDate = this.dateUtils.toDate(copy.createdDate); }
        if (copy.updatedDate) {copy.updatedDate = this.dateUtils.toDate(copy.updatedDate); }
        return this.http.put(this.resourceUrl, role);
    }

    public getRoles(): Observable<Role[]> {
        return this.http.get<Role[]>(this.resourceUrl);
    }

    public getRole(roleKey: string): Observable<Role> {
        return this.http.get<Role>(`${this.resourceUrl}/${roleKey}`);
    }

    public delete(roleKey: string): Observable<any> {
        return this.http.delete(`${this.resourceUrl}/${roleKey}`);
    }

    public getMatrix(): Observable<RoleMatrix> {
        return this.http.get<RoleMatrix>(`${this.resourceUrl}/matrix`);
    }

    public updateMatrix(roleMatrix: RoleMatrix): Observable<RoleMatrix> {
        return this.http.put<RoleMatrix>(`${this.resourceUrl}/matrix`, roleMatrix);
    }
}
