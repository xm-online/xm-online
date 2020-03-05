import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ISession {
    active: boolean;
}

/**
 * Keeping information about active session.
 * Broadcast session changes.
 * Store and restore session.
 */
@Injectable({providedIn: 'root'})
export class XmSessionService {

    protected session$: ReplaySubject<ISession> = new ReplaySubject<ISession>(1);

    public create(session: ISession = {active: true}): Observable<ISession> {
        this.session$.next(session);
        return this.get();
    }

    public get(): Observable<ISession> {
        return this.session$.asObservable();
    }

    public clear(): void {
        this.session$.next({active: false});
    }

    public isActive(): Observable<boolean>{
        return this.get().pipe(map((i)=>i.active));
    }
}
