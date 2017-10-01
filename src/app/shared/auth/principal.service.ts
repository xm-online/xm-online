import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AccountService } from './account.service';

@Injectable()
export class Principal {
    private userIdentity: any;
    private authenticated = false;
    private authenticationState = new Subject<any>();
    private promise: Promise<any>;

    constructor(
        private account: AccountService
    ) {}

    authenticate(identity) {
        this.userIdentity = identity;
        this.authenticated = identity !== null;
        this.authenticationState.next(this.userIdentity);
    }

    hasAnyAuthority(authorities: string[]): Promise<boolean> {
        if (!this.authenticated || !this.userIdentity || !this.userIdentity.authorities) {
            return Promise.resolve(false);
        }

        for (let i = 0; i < authorities.length; i++) {
            if (this.userIdentity.authorities.indexOf(authorities[i]) !== -1) {
                return Promise.resolve(true);
            }
        }

        return Promise.resolve(false);
    }

    hasAuthority(authority: string): Promise<boolean> {
        if (!this.authenticated) {
            return Promise.resolve(false);
        }

        return this.identity().then((id) => {
            return Promise.resolve(id.authorities && id.authorities.indexOf(authority) !== -1);
        }, () => {
            return Promise.resolve(false);
        });
    }

    identity(force?: boolean, mockUser?: boolean): Promise<any> {
        if (!force && this.promise) {
            return this.promise;
        } else {
            return this.promise = new Promise((resolve, reject) => {
                if (force === true) {
                    this.authenticated = false;
                    this.userIdentity = undefined;
                }

                // check and see if we have retrieved the userIdentity data from the server.
                // if we have, reuse it by immediately resolving
                if (this.userIdentity) {
                    this.promise = null;
                    resolve(this.userIdentity);
                    return;
                }

                // retrieve the userIdentity data from the server, update the identity object, and then resolve.
                this.account.get().toPromise()
                    .then((account) => {
                        this.promise = null;
                        if (account) {
                            this.userIdentity = account;
                            this.authenticated = true;
                        } else {
                            this.userIdentity = null;
                            this.authenticated = false;
                        }
                        this.authenticationState.next(this.userIdentity);
                        resolve(this.userIdentity);
                    }).catch((err) => {
                        this.promise = null;
                        if (mockUser) {
                            this.userIdentity = {
                                firstName: 'NoName',
                                lastName: 'NoName',
                                authorities: ['ROLE_USER']
                            };
                            this.authenticated = true;
                            this.authenticationState.next(this.userIdentity);
                            resolve(this.userIdentity);
                        } else {
                            this.userIdentity = null;
                            this.authenticated = false;
                            this.authenticationState.next(this.userIdentity);
                            throw (err);
                        }
                    });
            });
        }
    }

    isAuthenticated(): boolean {
        return this.authenticated;
    }

    isIdentityResolved(): boolean {
        return this.userIdentity !== undefined;
    }

    getAuthenticationState(): Observable<any> {
        return this.authenticationState.asObservable();
    }

    getImageUrl(): String {
        return this.isIdentityResolved() ? this.userIdentity.imageUrl : null;
    }

    getName(): String {
        return this.isIdentityResolved() ? this.userIdentity.firstName : null;
    }

    getLangKey(): string {
        return this.isIdentityResolved() ? this.userIdentity.langKey : null;
    }
}
