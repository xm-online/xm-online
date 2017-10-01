import {Injectable} from '@angular/core';
import { Http, Response, URLSearchParams, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { EventManager } from 'ng-jhipster';
import {Principal} from 'app/shared/auth/principal.service';

@Injectable()
export class XmEntitySpecService {

    private getXmEntitySpecsUrl = 'entity/api/xm-entity-specs';
    private generateXmEntityUrl = 'entity/api/xm-entity-specs/generate-xm-entity';

    private allTypes: any[] = [];
    private promiseAllType: Promise<any>;

    constructor(
        private http: Http,
        private eventManager: EventManager,
        private principal: Principal,
    ) {
        this.getAll(null, true);
        this.registerChangeAuth();
    }

    getAll(req?: any, isSaveType?: boolean): Promise<any> {
        if (isSaveType && this.promiseAllType) {
            return this.promiseAllType;
        } else {
            return this.principal.identity()
                .then(result => {
                    const options = this.createRequestOption(req);
                    let promise = this.http.get(this.getXmEntitySpecsUrl, options)
                        .toPromise()
                        .then((resp: Response) => {
                            this.promiseAllType = null;
                            return isSaveType ? (this.allTypes = resp.json()) : resp.json();
                        });
                    isSaveType && (this.promiseAllType = promise);
                    return promise;
                });
        }
    }

    generateXmEntity(req?: any): Observable<Response> {
        return this.http.post(this.generateXmEntityUrl + '?rootTypeKey=' + req.typeKey, null);
    }

    private createRequestOption(req?: any): BaseRequestOptions {
        const options: BaseRequestOptions = new BaseRequestOptions();
        if (req) {
            const params: URLSearchParams = new URLSearchParams();
            params.set('filter', req.filter);

            options.params = params;
        }
        return options;
    }

    private registerChangeAuth() {
        this.eventManager.subscribe('authenticationSuccess', resp => this.getAll(null, true));
    }

    getEntityType(): Promise<any> {
        if (this.allTypes.length) {
            return Promise.resolve(this.allTypes);
        } else {
            return this.getAll(null, true);
        }
    }

    getType(typeKey: string) {
        return this.allTypes.find(el => el.key === typeKey);
    }

    getState(typeKey: string, stateKey: string) {
        const type = this.getType(typeKey);
        if (type && type.states) {
            return type.states.find(el => el.key === stateKey);
        }
    }

    getLocations(typeKey: string) {
        const type = this.getType(typeKey);
        if (type && type.locations) {
            const result = {};
            for (const location of type.locations) {
                result[location.key] = location;
            }
            return result;
        }
    }

    getCalendars(typeKey: string) {
        const type = this.getType(typeKey);
        if (type && type.calendars) {
            const result = {};
            for (const calendar of type.calendars) {
                result[calendar.key] = calendar;
            }
            return result;
        }
    }

    getAttachments(typeKey: string) {
        const type = this.getType(typeKey);
        if (type && type.attachments) {
            const result = {};
            for (const attachment of type.attachments) {
                result[attachment.key] = attachment;
            }
            return result;
        }
    }

    getFormData(typeKey: string) {
        const type = this.getType(typeKey);
        try {
            return type && {
                    'schema': JSON.parse(type.dataSpec),
                    'layout': type.dataForm ? JSON.parse(type.dataForm) : null,
                };
        } catch (e) {
            return null;
        }
    }

    getStates(typeKey) {
        return this.getType(typeKey).states;
    }

    getNextStates(typeKey: string, stateKey: string) {
        const state = this.getState(typeKey, stateKey);
        if (!state) {
            return;
        }
        const nextStates: any[] = state.next;
        const result = [];

        if (nextStates) {
            for (const next of nextStates) {
                const nextState = this.getState(typeKey, next.stateKey);
                nextState.actionName = next.name;
                result.push(nextState);
            }
        }
        return result;
    }

    getFastSearch(typeKey: string) {
        const type = this.getType(typeKey);
        return type && type.fastSearch;
    }

    getLinkTypes(typeKey: string): any {
        const type = this.getType(typeKey);
        if (type && type.links) {
            const result = {};
            for (const link of type.links) {
                result[link.key] = link;
            }
            return result;
        }
    }

    getFunctions(typeKey: string): any {
        const type = this.getType(typeKey);
        if (type && type.functions) {
            return type.functions;
        }
    }

    getCommentTypes(typeKey: string): any {
        const type = this.getType(typeKey);
        if (type && type.comments) {
            const result = {};
            for (const comment of type.comments) {
                result[comment.key] = comment;
            }
            return result;
        }
    }

    getRatings(typeKey: string) {
        const type = this.getType(typeKey);
        if (type && type.ratings) {
            return type.ratings;
        }
    }

    findAllNonAbstractTypes() {
        return this.allTypes.filter(type => !type.isAbstract);
    }

    findNonAbstractTypesByPrefix(prefix: string) {
        const allNonAbstractTypes = this.findAllNonAbstractTypes();
        if (!prefix) {
            return allNonAbstractTypes;
        } else {
            return allNonAbstractTypes.filter(this.bySpecTypesPrefix(prefix));
        }
    }

    private bySpecTypesPrefix(prefix: string) {
        return t => t.key === prefix || t.key.startsWith(prefix + '.');
    }

}

export class LinkSpec {
    constructor(
        public key?: string,
        public builderType?: string,
        public name?: any,
        public icon?: string,
        public typeKey?: string,
        public max?: number
    ) {
    }
}
