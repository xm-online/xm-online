import { OnDestroy } from '@angular/core';
import { interval, ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { startWith, takeUntil } from 'rxjs/operators';

const TEN_MIN_INTERVAL = 600000;
const REQUEST_TIMEOUT = 60000;

export abstract class ACache<T> implements OnDestroy {

    constructor(protected reloadInterval: number = TEN_MIN_INTERVAL,
                protected requestTimeOut: number = REQUEST_TIMEOUT) {}

    private _cache$: ReplaySubject<T | null>;

    public get cache$(): Observable<T | null> {
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

    public clear(): void {
        this._cache$.next(null);
    }

    protected next(value: T): void {
        this._cache$.next(value);
    }

    protected abstract request(): Observable<T>;

    private initialize(): void {
        this._cache$ = new ReplaySubject<T>(1);
        interval(this.reloadInterval).pipe(
            startWith(0),
        ).subscribe(this.updateData.bind(this));
    }

    private updateData(): void {
        this.request().pipe(
            takeUntil(interval(this.requestTimeOut)),
        ).subscribe({
            next: this._cache$.next.bind(this._cache$),
            error: this._cache$.error.bind(this._cache$),
        });
    }
}
