import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { LoginService } from '../../shared';
import { Router } from '@angular/router';

export class AuthExpiredInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap(
            (event: HttpEvent<any>) => {
            },
            (err: any) => {
                if (err instanceof HttpErrorResponse) {
                    if (err.status === 401) {
                        const router: Router = this.injector.get(Router);
                        const stripedPath = router.parseUrl(router.url)
                            .root.children['primary']
                            .segments
                            .map(it => it.path)
                            .join('/');
                        // when user is anonymous he get 401 when request account, and can't reset password
                        if (stripedPath !== 'password/setup' && stripedPath !== 'reset/finish') {
                            const loginService: LoginService = this.injector.get(LoginService);
                            loginService.logout();
                        }
                    }
                }
            }
        ));
    }
}
