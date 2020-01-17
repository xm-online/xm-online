import { OnDestroy } from '@angular/core';
import { interval, ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { startWith, takeUntil } from 'rxjs/operators';

const TEN_MIN_INTERVAL = 600000;
const REQUEST_TIMEOUT = 60000;

export abstract class ACache<T> implements OnDestroy {

    private _cache$: ReplaySubject<T>;

    public get cache$(): Observable<T> {
        if (!this._cache$) {
            this.initialize();
        }
        return this._cache$.asObservable();
    }

    public ngOnDestroy(): void {
        this._cache$.complete();
    }

    public forceReload(): void {
        this.updateData();
    }

    protected next(value: T): void {
        this._cache$.next(value);
    }

    protected abstract request(): Observable<T>;

    private initialize(): void {
        this._cache$ = new ReplaySubject<T>(1);
        interval(TEN_MIN_INTERVAL).pipe(
            startWith(0),
        ).subscribe(this.updateData.bind(this));
    }

    private updateData(): void {
        this.request().pipe(
            takeUntil(interval(REQUEST_TIMEOUT)),
        ).subscribe({
            next: this._cache$.next.bind(this._cache$),
            error: this._cache$.error.bind(this._cache$)
        });
    }
}
