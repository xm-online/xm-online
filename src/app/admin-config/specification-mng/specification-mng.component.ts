import {animate, state, style, transition, trigger} from '@angular/animations';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

import {XmConfigService} from '../../shared/spec/config.service';
import {ConfigValidatorUtil} from './config-validator/config-validator.util';
import {ConfigVisualizerDialogComponent} from './config-visualizer-dialog/config-visualizer-dialog.component';
import {StatesManagementDialogComponent} from '../../xm-entity';
import { finalize } from 'rxjs/operators';

const TENANT_SPEC_PATH = '/tenant-config.yml';

@Component({
    selector: 'xm-specification-mng',
    templateUrl: './specification-mng.component.html',
    styleUrls: ['./specification-mng.component.css'],
    animations: [
        trigger('expandSection', [
            state('in', style({height: '*'})),
            transition(':enter', [
                style({height: 0}), animate(100),
            ]),
            transition(':leave', [
                style({height: '*'}),
                animate(100, style({height: 0})),
            ]),
        ]),
    ],
})
export class SpecificationMngComponent implements OnInit {

    specificationTypes = [
        {slug: 'ui', icon: 'view_quilt'},
        {slug: 'entity', icon: 'build'},
        {slug: 'timeline', icon: 'history'},
        {slug: 'uaa', icon: 'security'},
        {slug: 'uaa-login', icon: 'fingerprint'},
        {slug: 'tenant', icon: 'ballot'}
    ];
    currentSpecificationSlug = 'ui';

    isUiSpecValid = false;
    isTenantSpecValid = false;
    isXmEntitySpecValid = false;
    isTimelineSpecValid = false;
    isUaaSpecValid = false;
    isUaaLoginSpecValid = false;

    aceEditorOptions: any = {
        highlightActiveLine: true,
        maxLines: 10000000,
        printMargin: false,
        autoScrollEditorIntoView: true
    };
    line: number;

    entitySpecificationIn: string;
    entitySpecificationOut: string;
    entityValidation: any;
    uiSpecificationProgress: boolean;

    timelineSpecificationIn: string;
    timelineSpecificationOut: string;
    timelineValidation: any;

    loginsSpecificationIn: string;
    loginsSpecificationOut: string;
    loginsValidation: any;

    uiSpecificationIn: string;
    uiSpecificationOut: string;
    uiValidation: any;

    tenantSpecificationIn: string;
    tenantSpecificationOut: string;
    tenantValidation: any;
    tenantSpecificationProgress: boolean;

    uaaSpecificationIn: string;
    uaaSpecificationOut: string;
    uaaValidation: any;


    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private modalService: NgbModal,
                private service: XmConfigService) {
        this.activatedRoute.params.subscribe((params) => {
            this.currentSpecificationSlug = params['slug'];

            this.isTenantSpecValid = false;
            this.tenantValidation = null;
            this.isUiSpecValid = false;
            this.uiValidation = null;
        });
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
        this.service.getConfig(TENANT_SPEC_PATH).subscribe(result => {
            this.tenantSpecificationIn = result;
            this.tenantSpecificationOut = result;
        });

    }

    onUiSpecificationChange(textChanged) {
        this.uiSpecificationOut = textChanged;
        this.isUiSpecValid = false;
        this.uiValidation = null;
    }

    onTenantSpecificationChange(textChanged) {
        this.tenantSpecificationOut = textChanged;
        this.isTenantSpecValid = false;
        this.tenantValidation = null;
    }

    updateUiConfig() {
        this.uiSpecificationProgress = true;
        this.service
            .updateConfig('/webapp/settings-public.yml', this.uiSpecificationOut)
            .pipe(finalize(() => this.uiSpecificationProgress = false))
            .subscribe(() => window.location.reload());
    }

    updateTenantConfig() {
        this.tenantSpecificationProgress = true;
        this.service
            .updateConfig(TENANT_SPEC_PATH, this.tenantSpecificationOut)
            .pipe(finalize(() => this.tenantSpecificationProgress = false))
            .subscribe((res) => window.location.reload());
    }

    validateUiSpecification() {
        const errors = ConfigValidatorUtil.validateYAML(this.uiSpecificationOut);
        if (errors && errors.length) {
            this.uiValidation = {errorMessage: ''};
            for (const err of errors) {
                this.uiValidation.errorMessage += err.message + (err.path ? ' path: ' + err.path : '') + '<br/>';
                if (err.line) {
                    this.line = err.line;
                }
            }
        } else {
            this.isUiSpecValid = true;
        }
    }

    validateTenantSpecification() {
        const errors = ConfigValidatorUtil.validateYAML(this.tenantSpecificationOut);
        if (errors && errors.length) {
            this.tenantValidation = {errorMessage: ''};
            for (const err of errors) {
                this.tenantValidation.errorMessage += err.message + (err.path ? ' path: ' + err.path : '') + '<br/>';
                if (err.line) {
                    this.line = err.line;
                }
            }
        } else {
            this.isTenantSpecValid = true;
        }
    }

    updateEntityConfig() {
        this.service.updateXmEntitySpec(this.entitySpecificationOut).subscribe(() => {
            window.location.reload();
        });
    }

    onEntitySpecificationChange(textChanged) {
        this.isXmEntitySpecValid = false;
        this.entityValidation = null;
        this.entitySpecificationOut = textChanged;
    }

    validateXmEntitySpec() {
        const errors = ConfigValidatorUtil.validate(this.entitySpecificationOut);
        if (errors && errors.length) {
            this.entityValidation = {errorMessage: ''};
            for (const err of errors) {
                this.entityValidation.errorMessage += err.message + (err.path ? ' path: ' + err.path : '') + '<br/>';
                if (err.line) {
                    this.line = err.line;
                }
            }
        } else {
            this.isXmEntitySpecValid = true;
        }
    }

    onTimelineSpecificationChange(textChanged) {
        this.isTimelineSpecValid = false;
        this.timelineValidation = null;
        this.timelineSpecificationOut = textChanged;
    }

    validateTimelineConfig() {
        this.service.validateTimelineSpec(this.timelineSpecificationOut).subscribe(result => {
            this.timelineValidation = result;
            this.isTimelineSpecValid = !!this.timelineValidation.valid;
            this.renderValidationMessage(this.timelineValidation);
        });
    }

    updateTimelineConfig() {
        this.service.updateTimelineSpec(this.timelineSpecificationOut).subscribe(() => {
            this.isTimelineSpecValid = false;
            window.location.reload();
        });
    }

    onLoginsSpecificationChange(textChanged) {
        this.isUaaLoginSpecValid = false;
        this.loginsValidation = null;
        this.loginsSpecificationOut = textChanged;
    }

    validateLoginsSpecification() {
        this.service.validateLoginsSpec(this.loginsSpecificationOut).subscribe(result => {
            this.loginsValidation = result;
            this.isUaaLoginSpecValid = !!this.loginsValidation.valid;
            this.renderValidationMessage(this.loginsValidation);
        });
    }

    updateLoginsSpecification() {
        this.service.updateLoginsSpec(this.loginsSpecificationOut).subscribe(() => {
            this.isUaaLoginSpecValid = false;
            window.location.reload();
        });
    }

    onUaaSpecificationChange(textChanged) {
        this.isUaaSpecValid = false;
        this.uaaValidation = null;
        this.uaaSpecificationOut = textChanged;
    }

    validateUaaSpecification() {
        this.service.validateUaaSpec(this.uaaSpecificationOut).subscribe(result => {
            this.uaaValidation = result;
            this.isUaaSpecValid = !!this.uaaValidation.valid;
            this.renderValidationMessage(this.uaaValidation);
        });
    }

    updateUaaSpecification() {
        this.service.updateUaaSpec(this.uaaSpecificationOut).subscribe(() => {
            this.isUaaSpecValid = false;
            window.location.reload();
        });
    }

    onShowConfigVisualizerDialog() {
        const modalRef = this.modalService
            .open(ConfigVisualizerDialogComponent, {size: 'lg', backdrop: 'static', windowClass: 'xm-modal-extra-large'});
        modalRef.componentInstance.entitySpecification = this.entitySpecificationOut;
        return modalRef;
    }

    onShowConfigStatesManagementDialog() {
        return this.modalService
            .open(StatesManagementDialogComponent, {
                size: 'lg',
                backdrop: 'static',
                windowClass: 'xm-modal-extra-large'
            });
    }

    private renderValidationMessage(validation: any) {
        const errorMessage = validation.errorMessage;

        const regexp = new RegExp('^(.*)\\(class');
        const errors = regexp.exec(errorMessage);
        if (errors && errors.length > 1) {
            const error = errors[1];
            const line = new RegExp('line: (\\d)').exec(errorMessage);
            const column = new RegExp('column: (\\d)').exec(errorMessage);
            const lineNumber = line && line.length > 0 ? line[1] : '';
            const columnNumber = column && column.length > 0 ? column[1] : '';
            validation.errorMessage = `${error} | line: ${lineNumber} column: ${columnNumber}`;
        }
    }

}
