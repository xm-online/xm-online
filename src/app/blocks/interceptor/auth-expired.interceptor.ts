import {EventManager, HttpInterceptor} from 'ng-jhipster';
import { RequestOptionsArgs, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Injector } from '@angular/core';
import { AuthService } from '../../shared/auth/auth.service';
import { Principal } from '../../shared/auth/principal.service';
import { AuthServerProvider } from '../../shared/auth/auth-jwt.service';

export class AuthExpiredInterceptor extends HttpInterceptor {

    constructor(
        private injector: Injector,
        private eventManager: EventManager,
    ) {
        super();
    }

    requestIntercept(options?: RequestOptionsArgs): RequestOptionsArgs {
        return options;
    }

    responseIntercept(observable: Observable<Response>): Observable<Response> {
        return <Observable<Response>> observable.catch((error, source) => {
            if (error.status === 401 && !(error.json().path && error.json().path.indexOf('/api/account') === 0)) {
                const principal: Principal = this.injector.get(Principal);

                if (principal.isAuthenticated()) {
                    const auth: AuthService = this.injector.get(AuthService);
                    auth.authorize(true);
                } else {
                    const authServerProvider: AuthServerProvider = this.injector.get(AuthServerProvider);
                    authServerProvider.logout().subscribe();
                    this.eventManager.broadcast({name: 'xm.unauthorized', content: error});
                }
            }
            return Observable.throw(error);
        });
    }
}
