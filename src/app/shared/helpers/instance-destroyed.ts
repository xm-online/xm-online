import { OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';


export function instanceDestroyed(instance: OnDestroy): Observable<void> {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const oldNgOnDestroy = instance.ngOnDestroy;
    const stop$ = new Subject<void>();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    instance.ngOnDestroy = () => {
        oldNgOnDestroy.apply(instance);
        stop$.next();
        stop$.complete();
    };
    return stop$.asObservable();
}
