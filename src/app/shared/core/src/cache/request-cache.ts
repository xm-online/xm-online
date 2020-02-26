import { Injectable, OnDestroy } from '@angular/core';
import { interval, of, ReplaySubject } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { startWith, takeUntil } from 'rxjs/operators';

const TEN_MIN_INTERVAL = 600000;
const REQUEST_TIMEOUT = 60000;

const DEFAULT_OPTIONS = {
    reloadInterval: TEN_MIN_INTERVAL,
    requestTimeOut: REQUEST_TIMEOUT,
};

export interface IRequestCache<T> extends OnDestroy {

    get(): Observable<T | null>;

    forceReload(): void;

    ngOnDestroy(): void;

    clear(): void;
}

@Injectable()
export class RequestCache<T> implements IRequestCache<T> {

    private _cache$: ReplaySubject<T | null>;

    public options: typeof DEFAULT_OPTIONS = DEFAULT_OPTIONS;
    public request: () => Observable<T> = () => of(null);

    public get(): Observable<T | null> {
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
        if (!this._cache$) {
            return;
        }

        this._cache$.next(null);
    }

    public next(value: T): void {
        if (!this._cache$) {
            this._cache$ = new ReplaySubject<T>(1);
        }

        this._cache$.next(value);
    }

    private initialize(): void {
        this._cache$ = new ReplaySubject<T>(1);
        interval(this.options.reloadInterval).pipe(
            startWith(0),
        ).subscribe(this.updateData.bind(this));
    }

    private updateData(): void {
        this.request().pipe(
            takeUntil(interval(this.options.requestTimeOut)),
        ).subscribe({
            next: this._cache$.next.bind(this._cache$),
            error: this._cache$.error.bind(this._cache$),
        });
    }
}
