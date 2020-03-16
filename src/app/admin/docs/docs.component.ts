import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component } from '@angular/core';

import { SwaggerUIBundle } from 'swagger-ui-dist';

import { AuthServerProvider } from '@xm-ngx/core/auth';

@Component({
    selector: 'xm-docs',
    templateUrl: './docs.component.html',
})
export class JhiDocsComponent implements AfterViewInit {

    public swaggerResources: any[];
    public currentResource: any;

    constructor(
        private http: HttpClient,
        private auth: AuthServerProvider,
    ) {
    }

    public ngAfterViewInit(): void {
        this.http
            .get<any[]>('/swagger-resources')
            .subscribe((data: any[]) => {
                this.swaggerResources = data;
                this.currentResource = this.swaggerResources[0].location;
                this.updateSwagger(this.currentResource);
            });
    }

    public updateSwagger(resource: any): void {
        const authToken = this.auth.getToken();
        // tslint:disable-next-line:no-unused-expression
        new SwaggerUIBundle({
            // eslint-disable-next-line @typescript-eslint/camelcase
            dom_id: '#swaggerHolder',
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
            url: window.location.protocol + '//' + window.location.host + resource,
            docExpansion: 'none',
            apisSorter: 'alpha',
            showRequestHeaders: false,
            validatorUrl: null,
            configs: {
                preFetch: (req) => {
                    if (authToken) {
                        req.headers.Authorization = 'Bearer ' + authToken;
                    }
                    return req;
                },
            },
        });
    }
}
