import { Injectable } from '@angular/core';
import { RequestCache } from '@xm-ngx/core';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Spec } from './spec.model';
import { XmEntitySpec } from './xm-entity-spec.model';
import { XmEntitySpecService } from './xm-entity-spec.service';

@Injectable({providedIn: 'root'})
export class XmEntitySpecWrapperService {

    private entitySpec: RequestCache<XmEntitySpec[]> = new RequestCache<XmEntitySpec[]>(() => this.requestSpec());

    constructor(private xmEntitySpecService: XmEntitySpecService) {
    }

    public entitySpec$(): Observable<XmEntitySpec[]> {
        return this.entitySpec.get();
    }

    /** @deprecated use entitySpec$() instead */
    public spec(force: boolean = false): Promise<Spec> {
        if (force) {
            this.entitySpec.forceReload();
        }
        return this.specv2().pipe(take(1)).toPromise();
    }

    /** @deprecated use entitySpec$() instead */
    public specv2(): Observable<Spec> {
        return this.entitySpec.get().pipe(
            map((res) => ({types: res})),
        );
    }

    /** @deprecated use getByTypeKey(typeKey) instead */
    public xmSpecByKey(typeKey: string): Observable<XmEntitySpec> {
        return this.getByTypeKey(typeKey);
    }

    public clear(): void {
        this.entitySpec.clear();
    }

    public getByTypeKey(typeKey: string): Observable<XmEntitySpec | null> {
        return this.entitySpec.get().pipe(
            map((i) => i.find((xmSpec) => typeKey === xmSpec.key)),
        );
    }

    private requestSpec(): Observable<XmEntitySpec[]> {
        return this.xmEntitySpecService.getAll();
    }

}
