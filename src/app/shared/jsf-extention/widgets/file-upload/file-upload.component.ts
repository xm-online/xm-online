import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { JsonSchemaFormService } from 'angular2-json-schema-form';

@Component({
    selector: 'xm-ajfs-file-upload',
    templateUrl: 'file-upload.component.html',
    styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {

    options: any;
    controlValue: any;
    uploadingError = false;
    progress: number;
    file: any;
    @Input() layoutNode: any;

    constructor(private jsf: JsonSchemaFormService,
                private changeDetectorRef: ChangeDetectorRef,
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
        this.controlValue = null;
        this.progress = null;
        this.uploadingError = false;
        this.jsf.updateValue(this, this.controlValue);
    }

    private saveFile(formData: FormData, headers: HttpHeaders) {
        const apiUrl = this.options['url'] || null;
        this.uploadingError = false;
        if (apiUrl) {
            this.httpClient
                .post(apiUrl, formData,
                    {
                        headers: headers,
                        reportProgress: true,
                        observe: 'events'
                    }
                )
                .subscribe(event => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.updateProgress(event);
                    } else if (event.type === HttpEventType.Response) {
                        this.updateData(event.body);
                    }
                }, err => {
                    this.handleError(err)
                });
        }
    }

    private updateProgress(event) {
        this.progress = Math.round(100 * event.loaded / event.total);
        this.registerChanges();
    }

    private updateData(response) {
        this.jsf.updateValue(this, response['data']['key']);
        this.progress = null;
        this.registerChanges();
    }

    private handleError(err?: any) {
        err && console.error(err);
        this.uploadingError = true;
        this.progress = null;
        this.registerChanges();
    }

    private registerChanges(): void {
        this.changeDetectorRef.detectChanges();
    }
}
