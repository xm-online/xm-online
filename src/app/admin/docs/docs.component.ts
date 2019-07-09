import { AfterViewInit, Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import SwaggerUI from 'swagger-ui'


@Component({
    selector: 'xm-docs',
    templateUrl: './docs.component.html'
})
export class JhiDocsComponent implements OnInit, AfterViewInit {
    constructor(
        private http: HttpClient
    ) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.http.get('/swagger-resources').subscribe((data) => {
            console.log(data);
            SwaggerUI({
                dom_id: '#swagerTEMP',
                supportedSubmitMethods: ['get', 'post', 'put', 'delete', 'patch'],
                url: '/v2/api-docs',
                docExpansion: 'none'
            });
        });
    }
}
