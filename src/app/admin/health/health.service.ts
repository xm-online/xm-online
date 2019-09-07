import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from '../../xm.constants';

const SERVICES_COLLECTION = '/api/monitoring/services';

@Injectable()
export class JhiHealthService {
    separator: string;

    constructor(private http: HttpClient) {
        this.separator = '.';
    }

    getMonitoringServicesCollection(): Observable<any> {
        return this.http.get(SERVICES_COLLECTION);
    }

    getHealsCheckByMsName(msName: string, metricsType: string): Observable<any> {
        return this.http.get(`/api/monitoring/services/${msName}/${metricsType}`);
    }

    checkHealth(): Observable<any> {
        return this.http.get(SERVER_API_URL + 'management/health');
    }

    transformHealthData(data): any {
        const response = [];
        this.flattenHealthData(response, null, data.details);
        return response;
    }

    getBaseName(name): string {
        if (name) {
            const split = name.split('.');
            return split[0];
        }
        return name;
    }

    getSubSystemName(name): string {
        if (name) {
            const split = name.split('.');
            split.splice(0, 1);
            const remainder = split.join('.');
            return remainder ? ' - ' + remainder : '';
        }
        return name;
    }

    /* private methods */
    private addHealthObject(result, isLeaf, healthObject, name): any {
        const healthData: any = {
            name
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

    private flattenHealthData(result, path, data): any {
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

    private getModuleName(path, name): string {
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

    private hasSubSystem(healthObject): boolean {
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

    private isHealthObject(healthObject): boolean {
        let result = false;

        for (const key in healthObject) {
            if (healthObject.hasOwnProperty(key)) {
                if (key === 'status') {
                    result = true;
                }
            }
        }
        return result;
    }

}
