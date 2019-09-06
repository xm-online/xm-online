import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import {iif, Observable} from 'rxjs';
import { map } from 'rxjs/operators';

import { Principal } from '../../shared/auth/principal.service';
import { I18nNamePipe } from '../../shared/language/i18n-name.pipe';
import {FunctionService} from '../../xm-entity';

@Injectable()
export class NotificationsService {

    totalCount: string;

    constructor(
        private http: HttpClient,
        private principal: Principal,
        private eventManager: JhiEventManager,
        private i18nNamePipe: I18nNamePipe,
        private functionService: FunctionService
    ) {}

    public getNotifications(options: any): Observable<any> {
        return this.http.get(options.resourceUrl, {observe: 'response'}).pipe(
            map((response: HttpResponse<any>) => {
                this.totalCount = Number(response.headers.get('X-Total-Count')) > 0 ? response.headers.get('X-Total-Count') : null;
                const array: any = response.body || [];
                return array
                    .filter(e => e.stateKey === options.initialState)
                    .map(e => {
                        let label = e;
                        if (options.labelPath) {
                            label = this.byString(e, options.labelPath);
                        }
                        label = this.i18nNamePipe.transform(label, this.principal);
                        return {
                            label: label,
                            id: e.id,
                            typeKey: e.typeKey,
                            updateDate: options.showDate ? e.updateDate : null,
                            data: e.data
                        };
                    });
            }));
    }

    public markRead(id: number, config: any): Observable<any> {
        const targetState = config.changeStateName;
        const targetFunction = config.changeStateFunction;

        const apiUrl = `/entity/api/xm-entities/${id}/states/${targetState}`;

        const action$ = targetFunction ?
            this.functionService.callWithEntityId(id, targetFunction) :
            this.http.put(apiUrl, {observe: 'response'});

        return action$.pipe(
            map((response: HttpResponse<any>) => {
                this.eventManager.broadcast({name: 'notificationListUpdated'});
                return true;
            }));
    }

    byString(o, s) {
        s = s.replace(/\[(\w+)\]/g, '.$1');
        s = s.replace(/^\./, '');
        const a = s.split('.');
        for (let i = 0, n = a.length; i < n; ++i) {
            const k = a[i];
            if (k in o) {
                o = o[k];
            } else {
                return;
            }
        }
        return o;
    }

    nullSafeLabel(x) {
        return x ? '' + x.label ? '' + x.label : '' : '';
    }
}
