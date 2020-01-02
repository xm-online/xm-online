import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '../../xm.constants';

const SERVICES_COLLECTION = '/api/monitoring/services';

@Injectable()
export class JhiHealthService {
    public separator: string;

    constructor(private http: HttpClient) {
        this.separator = '.';
    }

    public getMonitoringServicesCollection(): Observable<any> {
        return this.http.get(SERVICES_COLLECTION);
    }

    public getHealsCheckByMsName(msName: string, metricsType: string): Observable<any> {
        return this.http.get(`/api/monitoring/services/${msName}/${metricsType}`);
    }

    public checkHealth(): Observable<any> {
        return this.http.get(SERVER_API_URL + 'management/health');
    }

    public transformHealthData(data: any): any {
        const response = [];
        this.flattenHealthData(response, null, data.details);
        return response;
    }

    public getBaseName(name: string): string {
        if (name) {
            const split = name.split('.');
            return split[0];
        }
        return name;
    }

    public getSubSystemName(name: string): string {
        if (name) {
            const split = name.split('.');
            split.splice(0, 1);
            const remainder = split.join('.');
            return remainder ? ' - ' + remainder : '';
        }
        return name;
    }

    /* private methods */
    private addHealthObject(result: any, isLeaf: any, healthObject: any, name: any): any {
        const healthData: any = {
            name,
        };

        const details = {};
        let hasDetails = false;

        for (const key in healthObject) {
            if (healthObject.hasOwnProperty(key)) {
                const value = healthObject[key];
                if (key === 'status' || key === 'error') {
                    healthData[key] = value;
                } else {
                    if (!this.isHealthObject(value)) {
                        details[key] = value;
                        hasDetails = true;
                    }
                }
            }
        }

        // Add the details
        if (hasDetails) {
            healthData.details = details;
        }

        // Only add nodes if they provide additional information
        if (isLeaf || hasDetails || healthData.error) {
            result.push(healthData);
        }
        return healthData;
    }

    private flattenHealthData(result: any, path: any, data: any): any {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const value = data[key];
                if (this.isHealthObject(value)) {
                    if (this.hasSubSystem(value)) {
                        this.addHealthObject(result, false, value, this.getModuleName(path, key));
                        this.flattenHealthData(result, this.getModuleName(path, key), value);
                    } else {
                        this.addHealthObject(result, true, value, this.getModuleName(path, key));
                    }
                }
            }
        }
        return result;
    }

    private getModuleName(path: any, name: any): string {
        let result;
        if (path && name) {
            result = path + this.separator + name;
        } else if (path) {
            result = path;
        } else if (name) {
            result = name;
        } else {
            result = '';
        }
        return result;
    }

    private hasSubSystem(healthObject: any): boolean {
        let result = false;

        for (const key in healthObject) {
            if (healthObject.hasOwnProperty(key)) {
                const value = healthObject[key];
                if (value && value.status) {
                    result = true;
                }
            }
        }
        return result;
    }

    private isHealthObject(healthObject: any): boolean {
        let result = false;

        for (const key in healthObject) {
            if (healthObject.hasOwnProperty(key) && key === 'status') {
                result = true;
            }
        }
        return result;
    }

}
