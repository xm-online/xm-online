import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { JsonSchemaFormService } from 'angular2-json-schema-form';

@Component({
    selector: 'xm-ajfs-file-upload',
    templateUrl: 'file-upload.component.html'
})
export class FileUploadComponent implements OnInit {

    options: any;
    controlValue: any;
    @Input() layoutNode: any;

    constructor(private jsf: JsonSchemaFormService, private httpClient: HttpClient) {
    }

    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }


    updateValue(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            const formData: FormData = new FormData();
            const headers: HttpHeaders = new HttpHeaders();
            formData.append('file', file, file.name);
            this.saveFile(formData, headers, file.name);
        }
    }

    private saveFile(formData: FormData, headers: HttpHeaders, name: string) {
        const apiUrl = this.options['url'] || null;
        if (apiUrl) {
            this.httpClient
                .post(this.options['url'], formData, { headers: headers})
                .subscribe(res => {
                    this.jsf.updateValue(this, name);
                });
        }
    }
}
