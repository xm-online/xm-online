import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import SwaggerUI from 'swagger-ui'

@Component({
    selector: 'xm-docs',
    templateUrl: './docs.component.html'
})
export class JhiDocsComponent implements OnInit, AfterViewInit {

    swaggerResources: any[];
    currentResource: any;

    constructor(
        private http: HttpClient
    ) {
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.http
            .get('/swagger-resources')
            .subscribe((data: any[]) => {
                this.swaggerResources = data;
                this.currentResource = this.swaggerResources[0].location;
                this.updateSwagger(this.currentResource);
            });
    }

    updateSwagger(resource) {
        console.log(resource);
        SwaggerUI({
            dom_id: '#swaggerHolder',
            supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
            url: resource,
            docExpansion: 'none',
            apisSorter: 'alpha',
            showRequestHeaders: false
        });
    }
}
