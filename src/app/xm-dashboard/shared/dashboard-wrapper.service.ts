import { Injectable } from '@angular/core';

import { Dashboard } from './dashboard.model';
import { DashboardService } from './dashboard.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class DashboardWrapperService {

    private promise: Promise<Dashboard[]>;
    private _dashboards: Dashboard[];

    constructor(private dashboardService: DashboardService) {
    }

    dashboards(force?: boolean, mockDashboards?: boolean): Promise<Dashboard[]> {
        if (!environment.production) {console.log(`DBG Get dashboards: ${force}`)}
        if (!force && this.promise) {
            return this.promise;
        } else {
            return this.promise = new Promise((resolve, reject) => {
                if (force === true) {
                    this._dashboards = undefined;
                }

                // check and see if we have retrieved the dashboards data from the server.
                // if we have, reuse it by immediately resolving
                if (this._dashboards) {
                    this.promise = null;
                    resolve(this._dashboards);
                    return;
                }

                // retrieve the dashboards data from the server, update the dashboardList object, and then resolve.
                this.dashboardService.query().toPromise().then((dashboardList) => {
                    this.promise = null;
                    if (dashboardList.body) {
                        this._dashboards = dashboardList.body;
                    } else {
                        this._dashboards = null;
                    }
                    resolve(this._dashboards);
                }).catch((err) => {
                    this.promise = null;
                    if (mockDashboards) {
                        this._dashboards = [];
                        resolve(this._dashboards);
                    } else {
                        this._dashboards = null;
                        throw (err);
                    }
                });
            });
        }
    }

}
