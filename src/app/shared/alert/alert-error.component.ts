import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { EventManager, AlertService } from 'ng-jhipster';
import { Subscription } from 'rxjs/Rx';
import {UseGlobalTranslations} from '../language/use.global.location';

@Component({
    selector: 'xm-alert-error',
    templateUrl: './alert-error.component.html'
})
@UseGlobalTranslations()
export class JhiAlertErrorComponent implements OnDestroy {

    alerts: any[];
    cleanHttpErrorListener: Subscription;

    constructor(private alertService: AlertService,
                private eventManager: EventManager,
                private translateService: TranslateService) {
        this.alerts = [];

        this.cleanHttpErrorListener = eventManager.subscribe('xm.httpError', (response) => {
            let i;
            const httpResponse = response.content;
            switch (httpResponse.status) {
                // connection refused, server not reachable
                case 0:
                    this.addErrorAlert('Server not reachable', 'error.server.not.reachable');
                    break;

                case 400:
                    const arr = Array.from(httpResponse.headers._headers);
                    const headers = [];
                    for (i = 0; i < arr.length; i++) {
                        if (arr[i][0].endsWith('app-error') || arr[i][0].endsWith('app-params')) {
                            headers.push(arr[i][0]);
                        }
                    }
                    headers.sort();
                    let errorHeader = null;
                    let entityKey = null;
                    if (headers.length > 1) {
                        errorHeader = httpResponse.headers.get(headers[0]);
                        entityKey = httpResponse.headers.get(headers[1]);
                    }
                    if (errorHeader) {
                        const entityName = translateService.instant('global.menu.entities.' + entityKey);
                        this.addErrorAlert(errorHeader, errorHeader, { entityName });
                    } else if (httpResponse.text() !== '' && httpResponse.json() && httpResponse.json().fieldErrors) {
                        const fieldErrors = httpResponse.json().fieldErrors;
                        for (i = 0; i < fieldErrors.length; i++) {
                            const fieldError = fieldErrors[i];
                            // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
                            const convertedField = fieldError.field.replace(/\[\d*\]/g, '[]');
                            const fieldName = translateService.instant('xm.' +
                                fieldError.objectName + '.' + convertedField);
                            this.addErrorAlert(
                                'Field ' + fieldName + ' cannot be empty', 'error.' + fieldError.message, { fieldName });
                        }
                    } else if (httpResponse.text() !== '' && httpResponse.json() && httpResponse.json().message) {
                        this.addErrorAlert(httpResponse.json().message, httpResponse.json().message, httpResponse.json().params);
                    }  else if (httpResponse.text() !== '' && httpResponse.json() && httpResponse.json().error && httpResponse.json().error_description) {
                        this.addErrorAlert(httpResponse.json().error_description, 'error.' + httpResponse.json().error);
                    } else {
                        this.addErrorAlert(httpResponse.text());
                    }
                    break;

                case 404:
                    this.addErrorAlert('Not found', 'error.url.not.found');
                    break;

                case 401:
                    if (httpResponse.text() !== '' && httpResponse.json() && httpResponse.json().error) {
                        if (httpResponse.json().error != 'invalid_token') {
                          this.addErrorAlert('Unauthorized', 'error.' + httpResponse.json().error);
                        }
                    } else if (httpResponse.text() !== '' && httpResponse.json() && httpResponse.json().error_description){
                        this.addErrorAlert('Unauthorized', httpResponse.json().error_description);
                    } else {
                        this.addErrorAlert(JSON.stringify(httpResponse)); // Fixme find a way to parse httpResponse
                    }
                    break;

                default:
                    if (httpResponse.text() !== '' && httpResponse.json() && httpResponse.json().error_description) {
                        this.addErrorAlert(httpResponse.json().error_description, httpResponse.json().error_description);
                    } else {
                        this.addErrorAlert(JSON.stringify(httpResponse)); // Fixme find a way to parse httpResponse
                    }
            }
        });

        this.cleanHttpErrorListener = eventManager.subscribe('thirdpaty.httpError', (response) => {
            this.addErrorAlert(response.content.error.message);
        });
    }

    ngOnDestroy() {
        if (this.cleanHttpErrorListener !== undefined && this.cleanHttpErrorListener !== null) {
            this.eventManager.destroy(this.cleanHttpErrorListener);
            this.alerts = [];
        }
    }

    addErrorAlert(message, key?, data?) {
        key = key && key !== null ? key : message;
        this.alerts.push(
            this.alertService.addAlert(
                {
                    type: 'danger',
                    msg: key,
                    params: data,
                    timeout: 5000,
                    toast: this.alertService.isToast(),
                    scoped: true
                },
                this.alerts
            )
        );
    }
}
