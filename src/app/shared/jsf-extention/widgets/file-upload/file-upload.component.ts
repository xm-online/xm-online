import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JsonSchemaFormService } from 'angular2-json-schema-form';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'xm-ajfs-file-upload',
    templateUrl: 'file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

    options: any;
    controlValue: any;
    uploading = false;
    uploadingError = false;
    file: any;
    @Input() layoutNode: any;

    constructor(private jsf: JsonSchemaFormService,
                private httpClient: HttpClient) {
    }

    ngOnInit() {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }

    updateFile(event) {
        if (event.target.files.length > 0) {
            this.file = event.target.files[0];
        }
    }

    uploadFile(fileData: any) {
        if (!fileData) {return false}
        const file = fileData;
        const formData: FormData = new FormData();
        const headers: HttpHeaders = new HttpHeaders();
        formData.append('file', file, file.name);
        this.saveFile(formData, headers);
    }

    resetFile() {
        this.file = null;
        this.jsf.updateValue(this, null);
    }

    private saveFile(formData: FormData, headers: HttpHeaders) {
        const apiUrl = this.options['url'] || null;
        this.uploadingError = false;
        if (apiUrl) {
            this.uploading = true;
            this.httpClient
                .post(apiUrl, formData, { headers: headers})
                .pipe(
                    finalize(() => this.uploading = false)
                )
                .subscribe(res => {
                    this.jsf.updateValue(this, res['data']['key']);
                }, err => {
                    this.uploadingError = true;
                    this.uploading = false;
                });
        }
    }
}
