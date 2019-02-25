import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export class NotificationInterceptor {

    constructor() {
    }

    responseIntercept(observable: Observable<any>): Observable<any> {
        return <Observable<Response>> observable.pipe(catchError((error) => {
            if (error && error.headers && error.headers._headers) {
                const arr = Array.from(error.headers._headers);
                const headers = [];
                let i;
                for (i = 0; i < arr.length; i++) {
                    if (arr[i][0].endsWith('app-alert') || arr[i][0].endsWith('app-params')) {
                        headers.push(arr[i][0]);
                    }
                }
                headers.sort();
                const alertKey = headers.length >= 1 ? error.headers.get(headers[0]) : null;
                if (typeof alertKey === 'string') {
                    // JhiAlertService.success(alertKey, { param: response.headers(headers[1])});
                }
            }
            return observableThrowError(error);
        }));
    }
}
