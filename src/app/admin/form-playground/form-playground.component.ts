import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
    formLayout, getJsfWidgets, addValidationComponent,
    addValidationComponentToLayout, processValidationMessages
} from '../../shared/jsf-extention/jsf-attributes-helper';
import { Examples } from './example-schemas.model';
import { Principal } from '../../shared/auth/principal.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { FunctionSpec, XmEntitySpec, XmEntitySpecWrapperService } from '../../xm-entity';
import { map, startWith, tap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

// declare var $: any;

interface FormsConfig {
    key: string;
    title: string;
    dataSpec: string;
    dataForm: string;
}



@Component({
    selector: 'xm-form-playground',
    templateUrl: './form-playground.component.html',
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
export class FormPlaygroundComponent implements OnInit, AfterViewInit {

    private XM_TEMPLATE = `ng2jsf-xm-layout`;

    examples = Examples;
    frameworkList: any = ['material-design', 'bootstrap-3', 'no-framework'];
    frameworks: any = {
        'material-design': 'Material Design framework',
        'bootstrap-3': 'Bootstrap 3 framework',
        'no-framework': 'No Framework (plain HTML controls)',
    };
    selectedSet = 'ng2jsf';
    selectedSetName = '';
    selectedExample = 'ng2jsf-flex-layout';
    selectedExampleName = 'Flexbox layout';
    selectedFramework = 'material-design';
    visible: { [item: string]: boolean } = {
        options: true,
        schema: true,
        form: true,
        output: true
    };

    formActive = false;
    jsonFormSchema: string;
    jsonFormValid = false;
    jsonFormStatusMessage = 'Loading form...';
    jsonFormObject: any;
    jsonFormOptions: any = {
        addSubmit: true, // Add a submit button if layout does not have one
        loadExternalAssets: true, // Load external css and JavaScript for frameworks
        formDefaults: {feedback: true}, // Show inline feedback icons
        debug: false,
        returnEmptyFields: false,
    };
    liveFormData: any = {};
    formValidationErrors: any;
    formIsValid: boolean = null;
    submittedFormData: any = null;
    aceEditorOptions: any = {
        highlightActiveLine: true,
        maxLines: 1000,
        printMargin: false,
        autoScrollEditorIntoView: true,
    };

    widgets = {};
    formLayout: Function;

    formSpecSearch = new FormControl();
    filteredSpecOptions$: Observable<XmEntitySpec[]>;
    specs$: Observable<XmEntitySpec[]>;
    spec$: Observable<XmEntitySpec>;
    specs: XmEntitySpec[] = [];
    // spec: XmEntitySpec;
    selectedSpec: string;
    selectedSpecKey$ = new Subject<string>();

    xmEntityForms: FormsConfig[] = [];
    xmEntityForms$ = new BehaviorSubject<FormsConfig[]>(this.xmEntityForms);

    formConfig$ = new BehaviorSubject<string>('');

    isXmForm = false;

    constructor(private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                private route: ActivatedRoute,
                public principal: Principal,
                private http: HttpClient) {
        this.widgets = getJsfWidgets();
        this.formLayout = formLayout;
    }

    ngOnInit() {
        // Subscribe to query string to detect schema to load
        this.route.queryParams.subscribe(
            params => {
                if (params['set']) {
                    this.selectedSet = params['set'];
                    this.selectedSetName = ({
                        ng2jsf: '',
                        asf: 'Angular Schema Form:',
                        rsf: 'React Schema Form:',
                        jsf: 'JSONForm:'
                    })[this.selectedSet];
                }
                if (params['example']) {
                    this.selectedExample = params['example'];
                    this.selectedExampleName = this.examples[this.selectedSet].schemas
                        .find(schema => schema.file === this.selectedExample).name;
                }
                if (params['framework']) {
                    this.selectedFramework = params['framework'];
                }
                this.loadSelectedExample(null, 'ng2jsf-flex-layout');
            }
        );

        this.specs$ = this.xmEntitySpecWrapperService.specv2()
            .pipe(
                map(specs => specs.types),
                tap((specs) => this.specs = specs)
            );

        this.filteredSpecOptions$ = this.formSpecSearch.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterSpec(value))
            );

    }

    private updateXmFormTemplate(spec: XmEntitySpec): FormsConfig[] {
        const xmForms = [];
        if (spec.dataSpec || spec.dataForm) {
            const dataSpec = spec.dataSpec ? spec.dataSpec : '{}';
            const dataForm = spec.dataForm ? spec.dataForm : '[]';
            const item = {key: 'dataForm', title: 'dataForm', dataSpec, dataForm};
            xmForms.push(item);
        }
        xmForms.push(...spec.functions.map(item => this.functionSpecToFormConfig(item)));
        return xmForms;
    }

    private functionSpecToFormConfig(item: FunctionSpec): FormsConfig {
        return {key: item.key,
            title: item.key,
            dataSpec: item.inputSpec ? item.inputSpec : '{}',
            dataForm: item.inputForm ? item.inputForm : '[]'}
    }

    ngAfterViewInit() {
    }

    onSubmit(data: any) {
        this.submittedFormData = data;
    }

    get prettySubmittedFormData() {
        return JSON.stringify(this.submittedFormData, null, 2);
    }

    onChanges(data: any) {
        this.liveFormData = data;
    }

    get prettyLiveFormData() {
        return JSON.stringify(this.liveFormData, null, 2);
    }

    isValid(isValid: boolean): void {
        this.formIsValid = isValid;
    }

    validationErrors(data: any): void {
        this.formValidationErrors = data;
    }

    get prettyValidationErrors() {
        if (!this.formValidationErrors) {
            return null;
        }
        let prettyValidationErrors = '';
        for (const error of this.formValidationErrors) {
            prettyValidationErrors += (error.dataPath.length ?
                error.dataPath.slice(1) + ' ' + error.message : error.message) + '\n';
        }
        return prettyValidationErrors;
    }

    private getSchemaTemplate(file): Observable<string> {
        return this.http.get(`assets/example-schemas/${file}.json`, {responseType: 'text'});
    }

    loadSelectedExample(event, file) {
        this.getSchemaTemplate(file).subscribe(schema => {
            this.isXmForm = (this.XM_TEMPLATE === file);
            this.jsonFormSchema = schema;
            this.formConfig$.next(schema);
            this.generateForm(this.jsonFormSchema);
        });
    }

    // Display the form entered by the user
    // (runs whenever the user changes the jsonform object in the ACE input field)
    generateForm(newFormString: string) {
        if (!newFormString) {
            return;
        }
        this.jsonFormStatusMessage = 'Loading form...';
        this.formActive = false;
        this.liveFormData = {};
        this.submittedFormData = null;

        // Most examples should be written in pure JSON,
        // but if an example schema includes a function,
        // it will be compiled it as Javascript instead
        try {

            // Parse entered content as JSON
            this.jsonFormObject = JSON.parse(newFormString);
            this.jsonFormObject.form = addValidationComponent(this.jsonFormObject.form);
            this.jsonFormObject.layout = addValidationComponentToLayout(this.jsonFormObject.layout);
            processValidationMessages(this.jsonFormObject);
            this.jsonFormValid = true;
        } catch (jsonError) {
            try {

                // If entered content is not valid JSON,
                // parse as JavaScript instead to include functions
                const newFormObject: any = null;
                eval('newFormObject = ' + newFormString);
                this.jsonFormObject = newFormObject;
                this.jsonFormObject.form = addValidationComponent(this.jsonFormObject.form);
                this.jsonFormObject.layout = addValidationComponentToLayout(this.jsonFormObject.layout);
                processValidationMessages(this.jsonFormObject);
                this.jsonFormValid = true;
            } catch (javascriptError) {

                // If entered content is not valid JSON or JavaScript, show error
                this.jsonFormValid = false;
                this.jsonFormStatusMessage =
                    'Entered content is not currently a valid JSON Form object.\n' +
                    'As soon as it is, you will see your form here. So keep typing. :-)\n\n' +
                    'JavaScript parser returned:\n\n' + jsonError;
                return;
            }
        }
        this.formActive = true;
    }

    private _filterSpec(value: string): XmEntitySpec[] {
        return this.specs
            .filter(option => option.key.toLowerCase().indexOf(value.toLowerCase()) === 0);
    }

    onEntitySelect(value: string) {
        this.xmEntityForms$.next([]);
        this.xmEntitySpecWrapperService.xmSpecByKey(value).pipe(
            map(spec => this.updateXmFormTemplate(spec))
        ).subscribe(
            data => this.xmEntityForms$.next(data),
            error => console.log(error)
        );
    }

    onSpecSelect(key: FormsConfig) {
        this.getSchemaTemplate(this.XM_TEMPLATE).pipe(
            map(tmpl => tmpl.replace('"schema": {}', `"schema": ${key.dataSpec}`)),
            map(tmpl => tmpl.replace('"layout": []', `"layout": ${key.dataForm}`)),
        ).subscribe(success => this.formConfig$.next(success))
    }

    toggleVisible(item: string) {
        this.visible[item] = !this.visible[item];
    }

    toggleFormOption(option: string) {
        if (option === 'feedback') {
            this.jsonFormOptions.formDefaults.feedback =
                !this.jsonFormOptions.formDefaults.feedback;
        } else {
            this.jsonFormOptions[option] = !this.jsonFormOptions[option];
        }
        this.generateForm(this.jsonFormSchema);
    }
}
