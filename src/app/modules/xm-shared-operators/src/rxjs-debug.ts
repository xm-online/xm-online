/* eslint-disable no-console,no-debugger */
import { MonoTypeOperatorFunction } from 'rxjs';
import { tap } from 'rxjs/operators';

export function debug<T>(key: string | number, isDebugger: boolean = true): MonoTypeOperatorFunction<T> {

    return tap<T>({
        next: (data) => {
            if (isDebugger) {
                debugger
            }
            console.log(`NEXT: ${key} `, data);
        },
        error: (err) => {
            if (isDebugger) {
                debugger
            }
            console.log(`ERROR: ${key} `, err);
        },
        complete: () => {
            if (isDebugger) {
                debugger
            }
            console.log(`COMPLETE: ${key} `);
        },
    });
}
