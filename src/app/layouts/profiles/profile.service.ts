import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProfileInfo } from './profile-info.model';

@Injectable()
export class ProfileService {

    private profileInfoUrl: string = 'api/profile-info';

    constructor(private http: HttpClient) { }

    public getProfileInfo(): Observable<ProfileInfo> {
        return this.http.get<any>(this.profileInfoUrl).pipe(map((data) => {
            const pi = new ProfileInfo();
            pi.activeProfiles = data.activeProfiles;
            pi.ribbonEnv = data.ribbonEnv;
            pi.inProduction = data.activeProfiles.indexOf('prod') !== -1;
            pi.swaggerEnabled = data.activeProfiles.indexOf('swagger') !== -1;
            return pi;
        }));
    }
}
