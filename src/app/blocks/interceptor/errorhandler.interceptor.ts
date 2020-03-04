import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { XmEventManager } from '@xm-ngx/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ContextService } from '../../shared';

export class ErrorHandlerInterceptor implements HttpInterceptor {

    constructor(private eventManager: XmEventManager,
                private contextService: ContextService) {
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap({
            error: (err: any) => {
                if (err instanceof HttpErrorResponse
                    && !(err.status === 401
                        && (err.message === '' || (err.url && err.url.includes('/api/account'))))) {
                    // TODO: this is workaround to get eventManager from root injector
                    this.eventManager = this.contextService ? this.contextService.eventManager : this.eventManager;
                    this.eventManager.broadcast({name: 'xm.httpError', content: err, request});
                }
            },
        }));
    }
}
