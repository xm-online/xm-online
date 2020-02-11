/* eslint-disable @typescript-eslint/unbound-method */
import { OnDestroy } from '@angular/core';
import { MonoTypeOperatorFunction, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export function takeUntilOnDestroy<T>(instance: OnDestroy): MonoTypeOperatorFunction<T> {
    const prevNgOnDestroy = instance.ngOnDestroy;
    const destroy$ = new Subject<void>();

    instance.ngOnDestroy = (): void => {
        prevNgOnDestroy.apply(instance);
        destroy$.next();
        destroy$.complete();
    };

    return takeUntil(destroy$.asObservable());
}
