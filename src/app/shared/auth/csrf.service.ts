import { Injectable } from '@angular/core';
import { CookieService } from 'angular2-cookie/core';

@Injectable()
export class CSRFService {

    constructor(private cookieService: CookieService) {}

    public getCSRF(name?: string): any {
        name = `${name ? name : 'XSRF-TOKEN'}`;
        return this.cookieService.get(name);
    }
}
