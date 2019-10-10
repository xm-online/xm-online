import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {defaultIfEmpty, filter, flatMap, map, shareReplay} from 'rxjs/operators';

import { Spec } from './spec.model';
import { XmEntitySpecService } from './xm-entity-spec.service';
import {environment} from '../../../environments/environment';
import {XmEntitySpec} from './xm-entity-spec.model';

const CACHE_SIZE = 1;

@Injectable()
export class XmEntitySpecWrapperService {

    private promise: Promise<Spec>;
    private _spec: Spec;

    private cache$: Observable<Spec>;

    constructor(private xmEntitySpecService: XmEntitySpecService) {
        if (!environment.production) {
            console.log(`DBG Creating XmEntitySpecWrapperService`);
        }
    }

    spec(force?: boolean, mockSpec?: boolean): Promise<Spec> {
        if (!force && this.promise) {
            if (!environment.production) {console.log('DBG Promise from cache')}
            return this.promise;
        } else {
            return this.promise = new Promise((resolve) => {
                if (force === true) {
                    this._spec = undefined;
                }

                // check and see if we have retrieved the spec data from the server.
                // if we have, reuse it by immediately resolving
                if (this._spec) {
                    this.promise = null;
                    resolve(this._spec);
                    return;
                }

                if (!environment.production) {console.log('DBG New Promise')}

                // retrieve the spec data from the server, update the _spec object, and then resolve.
                this.xmEntitySpecService.get().toPromise().then((spec) => {
                    this.promise = null;
                    if (spec.body) {
                        this._spec = { types: spec.body };
                    } else {
                        this._spec = null;
                    }
                    resolve(this._spec);
                }).catch((err) => {
                    this.promise = null;
                    if (mockSpec) {
                        this._spec = {};
                        resolve(this._spec);
                    } else {
                        this._spec = null;
                        throw (err);
                    }
                });
            });
        }
    }

    specv2(force?: boolean): Observable<Spec> {
        if (!this.cache$) {
            if (!environment.production) {console.log('DBG from cache$')}
            this.cache$ = this.requestSpec().pipe(
                shareReplay(CACHE_SIZE)
            )
        }
        return this.cache$;
    }

    xmSpecByKey(typeKey: string): Observable<XmEntitySpec> {
        return this.specv2().pipe(
            defaultIfEmpty({types: []} as Spec),
            flatMap((spec) => spec.types),
            filter((xmSpec) => typeKey === xmSpec.key),
        );
    }

    clear() {
        if (!environment.production) {
            console.log(`DBG XmEntitySpecWrapperService.clear`);
        }
        if (this.cache$) {
            this.cache$ = null;
        }
        if (this.promise) {
            this.promise = null;
            this._spec = null;
        }
    }

    private requestSpec(): Observable<Spec> {
        return this.xmEntitySpecService.get().pipe(
            map(httpResp => { return { types: httpResp.body }}));
    }

}
