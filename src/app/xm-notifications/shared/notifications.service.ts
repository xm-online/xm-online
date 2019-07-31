import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Principal } from '../../shared/auth/principal.service';
import { I18nNamePipe } from '../../shared/language/i18n-name.pipe';

@Injectable()
export class NotificationsService {
    constructor(
        private http: HttpClient,
        private principal: Principal,
        private eventManager: JhiEventManager,
        private i18nNamePipe: I18nNamePipe
    ) {
    }

    public getNotifications(options: any): Observable<any> {
        return this.http.get(options.resourceUrl, {observe: 'response'}).pipe(
            map((response: HttpResponse<any>) => {
                let array: any = response.body;
                array = array ? array : [];
                let elements = [];
                array.forEach(e => {
                    if (e.stateKey === options.initialState) {
                        let label = e;
                        if (options.labelPath) {
                            label = this.byString(e, options.labelPath);
                        }
                        label = this.i18nNamePipe.transform(label, this.principal);
                        elements.push({
                            label: label,
                            id: e.id,
                            typeKey: e.typeKey,
                            updateDate: options.showDate ? e.updateDate : null
                        });
                    }
                });
                return elements;
            }));
    }

    public markRead(id: number, targetSate: string): Observable<any> {
        const apiUrl = `/entity/api/xm-entities/${id}/states/${targetSate}`;
        return this.http.put(apiUrl, {observe: 'response'}).pipe(
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
