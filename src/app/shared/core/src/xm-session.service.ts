import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, filter, pluck } from 'rxjs/operators';

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

    public create(session: ISession = {active: true}): void {
        this.session$.next(session);
    }

    public update(session: ISession = {active: true}): void {
        this.session$.next(session);
    }

    public get(): Observable<ISession> {
        return this.session$.asObservable();
    }

    public clear(): void {
        this.session$.next({active: false});
    }

    public isActive(): Observable<boolean> {
        return this.get().pipe(
            filter<ISession>(Boolean),
            pluck('active'),
            distinctUntilChanged(),
        );
    }
}
