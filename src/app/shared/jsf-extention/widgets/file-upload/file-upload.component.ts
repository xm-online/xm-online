import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { JsonSchemaFormService } from 'angular2-json-schema-form';

@Component({
    selector: 'xm-ajfs-file-upload',
    templateUrl: 'file-upload.component.html',
    styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit, OnDestroy {

    public options: any;
    public controlValue: any;
    public uploadingError: boolean = false;
    public progress: number;
    public file: any;
    public uploadProcess: any;

    @Input() public layoutNode: any;

    constructor(private jsf: JsonSchemaFormService,
                private changeDetectorRef: ChangeDetectorRef,
                private httpClient: HttpClient) {
    }

    public ngOnInit(): void {
        this.options = this.layoutNode.options || {};
        this.jsf.initializeControl(this);
    }

    public ngOnDestroy(): void {
        if (this.uploadProcess) {
            this.uploadProcess.unsubscribe();
        }
    }

    public updateFile(event: any): void {
        if (event.target.files.length > 0) {
            this.file = event.target.files[0];
        }
    }

    public uploadFile(fileData: any): void {
        if (!fileData) {return undefined; }
        const file = fileData;
        const formData: FormData = new FormData();
        formData.append('file', file, file.name);

        if (this.options.tokenSource) {
            this.httpClient
                .get(this.options.tokenSource)
                .subscribe((resp: any) => {
                    const headers: HttpHeaders = new HttpHeaders({
                        Authorization: resp.token_type + ' ' + resp.access_token,
                    });
                    this.saveFile(formData, headers);
                });
        } else {
            this.saveFile(formData);
        }

    }

    public resetFile(): void {
        this.file = null;
        this.controlValue = null;
        this.progress = null;
        this.uploadingError = false;
        this.jsf.updateValue(this, this.controlValue);
    }

    private saveFile(formData: FormData, headers?: HttpHeaders): void {
        const apiUrl = this.options.url || null;
        this.uploadingError = false;
        if (apiUrl) {
            this.uploadProcess = this.httpClient
                .post(apiUrl, formData,
                    {
                        headers,
                        reportProgress: true,
                        observe: 'events',
                    },
                ).subscribe((event) => {
                    if (event.type === HttpEventType.UploadProgress) {
                        this.updateProgress(event);
                    } else if (event.type === HttpEventType.Response) {
                        this.updateData(event.body);
                    }
                }, (err) => {
                    this.handleError(err);
                });
        }
    }

    private updateProgress(event: any): void {
        this.progress = Math.round(100 * event.loaded / event.total);
        this.registerChanges();
    }

    private updateData(res: any): void {
        this.jsf.updateValue(this, res.data.key);
        this.progress = null;
        this.registerChanges();
    }

    private handleError(err?: any): void {
        console.warn(err);
        this.uploadingError = true;
        this.progress = null;
        this.registerChanges();
    }

    private registerChanges(): void {
        this.changeDetectorRef.detectChanges();
    }
}
