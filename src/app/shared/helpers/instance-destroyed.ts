/* tslint:disable:unbound-method */
import { OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export function instanceDestroyed(instance: OnDestroy): Observable<void> {
    const oldNgOnDestroy = instance.ngOnDestroy;
    const stop$ = new Subject<void>();
    instance.ngOnDestroy = () => {
        oldNgOnDestroy.apply(instance);
        stop$.next();
        stop$.complete();
    };
    return stop$.asObservable();
}
