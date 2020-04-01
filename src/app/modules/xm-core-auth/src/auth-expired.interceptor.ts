import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';

import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoginService } from '../../../shared/auth/login.service';

@Injectable()
export class AuthExpiredInterceptor implements HttpInterceptor {

    constructor(private injector: Injector) {
    }

    public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(tap({
            error: (err: any) => {
                if (err instanceof HttpErrorResponse && err.status === 401) {
                    const router: Router = this.injector.get(Router);
                    const stripedPath = router.parseUrl(router.url)
                        .root.children.primary
                        .segments
                        .map((it) => it.path)
                        .join('/');
                    // when user is anonymous he get 401 when request account, and can't reset password
                    if (stripedPath !== 'password/setup' && stripedPath !== 'reset/finish') {
                        const loginService: LoginService = this.injector.get(LoginService);
                        loginService.logout();
                    }
                }
            },
        }));
    }
}
