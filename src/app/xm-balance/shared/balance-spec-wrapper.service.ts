import { Injectable } from '@angular/core';

import { BalanceSpecService } from './balance-spec.service';
import { Spec } from './spec.model';

@Injectable()
export class BalanceSpecWrapperService {

    private promise: Promise<Spec>;
    private _spec: Spec;

    constructor(private balanceSpecService: BalanceSpecService) {
    }

    spec(force?: boolean, mockSpec?: boolean): Promise<Spec> {
        if (!force && this.promise) {
            return this.promise;
        } else {
            return this.promise = new Promise((resolve, reject) => {
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

                // retrieve the spec data from the server, update the _spec object, and then resolve.
                this.balanceSpecService.get().toPromise().then((spec) => {
                    this.promise = null;
                    if (spec.body) {
                        this._spec = spec.body;
                    } else {
                        this._spec = null;
                    }
                    resolve(this._spec);
                }).catch((err) => {
                    this.promise = null;
                    if (mockSpec || err.status === 404) {
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

}
