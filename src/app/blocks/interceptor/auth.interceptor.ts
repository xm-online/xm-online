import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { Observable } from 'rxjs';

import { CONFIG_SETTINGS_API, TOKEN_URL } from '../../shared';
import { SERVER_API_URL } from '../../xm.constants';

export class AuthInterceptor implements HttpInterceptor {

    constructor(private localStorage: LocalStorageService,
                private sessionStorage: SessionStorageService) {
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
        if (!request || !request.url || ((/^http/).test(request.url)
            && !(SERVER_API_URL && request.url.startsWith(SERVER_API_URL)))) {
            return next.handle(request);
        }

        if ((TOKEN_URL === request.url) || (CONFIG_SETTINGS_API === request.url)) {
            return next.handle(request);
        }

        const token = this.localStorage.retrieve('authenticationToken')
            || this.sessionStorage.retrieve('authenticationToken');
        const noAuthHeader = !request.headers.get('Authorization');
        if (!!token && noAuthHeader) {
            request = request.clone({
                setHeaders: {
                    Authorization: 'Bearer ' + token,
                },
            });
        }
        return next.handle(request);
    }

}
