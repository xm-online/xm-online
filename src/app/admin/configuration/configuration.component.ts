import {AfterViewInit, Component, OnInit} from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {Http} from '@angular/http';
import {JhiLanguageService} from 'ng-jhipster';
import {XmConfigService} from './config.service';

@Component({
    selector: 'xm-configuration',
    templateUrl: './configuration.component.html',
    animations: [
        trigger('expandSection', [
            state('in', style({ height: '*' })),
            transition(':enter', [
                style({ height: 0 }), animate(100),
            ]),
            transition(':leave', [
                style({ height: '*' }),
                animate(100, style({ height: 0 })),
            ]),
        ]),
    ],
    styles: []
})
export class ConfigurationComponent implements OnInit, AfterViewInit {

    aceEditorOptions: any = {
        highlightActiveLine: true,
        maxLines: 10000000,
        printMargin: false,
        autoScrollEditorIntoView: true
    };

    entitySpecificationIn: string;
    entitySpecificationOut: string;
    entityValidation: any;

    timelineSpecificationIn: string;
    timelineSpecificationOut: string;
    timelineValidation: any;

    loginsSpecificationIn: string;
    loginsSpecificationOut: string;
    loginsValidation: any;

    uiSpecificationIn: string;
    uiSpecificationOut: string;

    uaaSpecificationIn: string;
    uaaSpecificationOut: string;
    uaaValidation: any;


    constructor(private jhiLanguageService: JhiLanguageService,
                private route: ActivatedRoute,
                private router: Router,
                private http: Http,
                private service: XmConfigService) {
        jhiLanguageService.addLocation('configuration');
    }

    ngOnInit() {
        this.service.getConfig('/entity/xmentityspec.yml').subscribe(result => {
            this.entitySpecificationIn = result;
            this.entitySpecificationOut = result;
        });
        this.service.getConfig('/timeline/timeline.yml').subscribe(result => {
            this.timelineSpecificationIn = result;
            this.timelineSpecificationOut = result;
        });
        this.service.getConfig('/uaa/logins.yml').subscribe(result => {
            this.loginsSpecificationIn = result;
            this.loginsSpecificationOut = result;
        });
        this.service.getConfig('/uaa/uaa.yml').subscribe(result => {
            this.uaaSpecificationIn = result;
            this.uaaSpecificationOut = result;
        });
        this.service.getConfig('/webapp/settings-public.yml').subscribe(result => {
            this.uiSpecificationIn = result;
            this.uiSpecificationOut = result;
        });
    }

    updateUiConfig() {
        this.service.updateConfig('/webapp/settings-public.yml', this.uiSpecificationOut).subscribe(result => {
            window.location.reload();
        });
    }

    validateTimelineConfig() {
        this.service.validateTimelineSpec(this.timelineSpecificationOut).subscribe(result => {
            this.timelineValidation = result.json();
            this.renderValidationMessage(this.timelineValidation);
        });
    }

    updateTimelineConfig() {
        this.service.updateTimelineSpec(this.timelineSpecificationOut).subscribe(result => {
            window.location.reload();
        });
    }

    onTimelineSpecificationChange(textChanged) {
        this.timelineValidation = null;
        this.timelineSpecificationOut = textChanged;
    }

    onUiSpecificationChange(textChanged) {
        this.uiSpecificationOut = textChanged;
    }

    updateEntityConfig() {
        this.service.updateXmEntitySpec(this.entitySpecificationOut).subscribe(result => {
            window.location.reload();
        });
    }

    validateEntitySpecification() {
        this.service.validateEntitySpec(this.entitySpecificationOut).subscribe(result => {
            this.entityValidation = result.json();
            this.renderValidationMessage(this.entityValidation);
        });
    }

    onEntitySpecificationChange(textChanged) {
        this.entityValidation = null;
        this.entitySpecificationOut = textChanged;
    }

    private renderValidationMessage(validation: any) {
        let errorMessage = validation.errorMessage;

        let regexp = new RegExp('^(.*)\\(class');
        let errors = regexp.exec(errorMessage);
        if (errors && errors.length > 1) {
            let error = errors[1];
            let line = new RegExp('line: (\\d)').exec(errorMessage);
            let column = new RegExp('column: (\\d)').exec(errorMessage);
            let lineNumber = line && line.length > 0 ? line[1] : "";
            let columnNumber = column && column.length > 0 ? column[1] : "";
            validation.errorMessage = `${error} | line: ${lineNumber} column: ${columnNumber}`;
        }
    }

    validateLoginsSpecification() {
        this.service.validateLoginsSpec(this.loginsSpecificationOut).subscribe(result => {
            this.loginsValidation = result.json();
            this.renderValidationMessage(this.loginsValidation);
        });
    }

    updateLoginsSpecification() {
        this.service.updateLoginsSpec(this.loginsSpecificationOut).subscribe(result => {
            window.location.reload();
        });
    }

    onLoginsSpecificationChange(textChanged) {
        this.loginsValidation = null;
        this.loginsSpecificationOut = textChanged;
    }


    validateUaaSpecification() {
        this.service.validateUaaSpec(this.uaaSpecificationOut).subscribe(result => {
            this.uaaValidation = result.json();
            this.renderValidationMessage(this.uaaValidation);
        });
    }

    updateUaaSpecification() {
        this.service.updateUaaSpec(this.uaaSpecificationOut).subscribe(result => {
            window.location.reload();
        });
    }

    onUaaSpecificationChange(textChanged) {
        this.uaaValidation = null;
        this.uaaSpecificationOut = textChanged;
    }



    ngAfterViewInit() {

    }

}
