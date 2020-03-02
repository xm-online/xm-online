import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';

import {
    addValidationComponent,
    addValidationComponentToLayout,
    formLayout,
    getJsfWidgets,
    processValidationMessages,
} from '../../shared/jsf-extention/jsf-attributes-helper';
import { FunctionSpec, XmEntitySpec, XmEntitySpecWrapperService } from '../../xm-entity';
import { EXAMPLES } from './example-schemas.model';

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
export class FormPlaygroundComponent implements OnInit {

    public examples: typeof EXAMPLES = EXAMPLES;
    public frameworkList: any = ['material-design', 'bootstrap-3', 'no-framework'];
    public frameworks: any = {
        'material-design': 'Material Design framework',
        'bootstrap-3': 'Bootstrap 3 framework',
        'no-framework': 'No Framework (plain HTML controls)',
    };
    public selectedSet: string = 'ng2jsf';
    public selectedSetName: string = '';
    public selectedExample: string = 'ng2jsf-flex-layout';
    public selectedExampleName: string = 'Flexbox layout';
    public selectedFramework: string = 'material-design';
    public visible: { [item: string]: boolean } = {
        options: true,
        schema: true,
        form: true,
        output: true,
    };
    public formActive: boolean = false;
    public jsonFormSchema: string;
    public jsonFormValid: boolean = false;
    public jsonFormStatusMessage: string = 'Loading form...';
    public jsonFormObject: any;
    public jsonFormOptions: any = {
        addSubmit: true, // Add a submit button if layout does not have one
        loadExternalAssets: true, // Load external css and JavaScript for frameworks
        formDefaults: {feedback: true}, // Show inline feedback icons
        debug: false,
        returnEmptyFields: false,
    };
    public liveFormData: any = {};
    public formValidationErrors: any;
    public formIsValid: boolean = null;
    public submittedFormData: any = null;
    public aceEditorOptions: any = {
        highlightActiveLine: true,
        maxLines: 1000,
        printMargin: false,
        autoScrollEditorIntoView: true,
    };
    public widgets: any = {};
    public formLayout: () => void;
    public formSpecSearch: any = new FormControl();
    public filteredSpecOptions$: Observable<XmEntitySpec[]>;
    public specs$: Observable<XmEntitySpec[]>;
    public spec$: Observable<XmEntitySpec>;
    public specs: XmEntitySpec[] = [];
    // spec: XmEntitySpec;
    public selectedSpec: string;
    public selectedSpecKey$: Subject<any> = new Subject<string>();
    public xmEntityForms: FormsConfig[] = [];
    public xmEntityForms$: BehaviorSubject<any> = new BehaviorSubject<FormsConfig[]>(this.xmEntityForms);
    public formConfig$: BehaviorSubject<any> = new BehaviorSubject<string>('');
    public isXmForm: boolean = false;
    private XM_TEMPLATE: string = `ng2jsf-xm-layout`;

    constructor(private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                private route: ActivatedRoute,
                private http: HttpClient) {
        this.widgets = getJsfWidgets();
        this.formLayout = formLayout;
    }

    public get prettySubmittedFormData(): string {
        return JSON.stringify(this.submittedFormData, null, 2);
    }

    public get prettyLiveFormData(): string {
        return JSON.stringify(this.liveFormData, null, 2);
    }

    public get prettyValidationErrors(): string | null {
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

    public ngOnInit(): void {
        // Subscribe to query string to detect schema to load
        this.route.queryParams.subscribe(
            (params) => {
                if (params.set) {
                    this.selectedSet = params.set;
                    this.selectedSetName = ({
                        ng2jsf: '',
                        asf: 'Angular Schema Form:',
                        rsf: 'React Schema Form:',
                        jsf: 'JSONForm:',
                    })[this.selectedSet];
                }
                if (params.example) {
                    this.selectedExample = params.example;
                    this.selectedExampleName = this.examples[this.selectedSet].schemas
                        .find((schema) => schema.file === this.selectedExample).name;
                }
                if (params.framework) {
                    this.selectedFramework = params.framework;
                }
                this.loadSelectedExample(null, 'ng2jsf-flex-layout');
            },
        );

        this.specs$ = this.xmEntitySpecWrapperService.specv2()
            .pipe(
                map((specs) => specs.types),
                tap((specs) => this.specs = specs),
            );

        this.filteredSpecOptions$ = this.formSpecSearch.valueChanges
            .pipe(
                startWith(''),
                map((value) => this._filterSpec(value as any)),
            );

    }

    public onSubmit(data: any): void {
        this.submittedFormData = data;
    }

    public onChanges(data: any): void {
        this.liveFormData = data;
    }

    public isValid(isValid: boolean): void {
        this.formIsValid = isValid;
    }

    public validationErrors(data: any): void {
        this.formValidationErrors = data;
    }

    public loadSelectedExample(event: any, file: any): void {
        this.getSchemaTemplate(file).subscribe((schema) => {
            this.isXmForm = (this.XM_TEMPLATE === file);
            this.jsonFormSchema = schema;
            this.formConfig$.next(schema);
            this.generateForm(this.jsonFormSchema);
        });
    }

    // (runs whenever the user changes the jsonform object in the ACE input field)
    public generateForm(newFormString: string): void {
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
                // tslint:disable-next-line:no-eval
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

    public onEntitySelect(value: string): void {
        this.xmEntityForms$.next([]);
        this.xmEntitySpecWrapperService.xmSpecByKey(value).pipe(
            map((spec) => this.updateXmFormTemplate(spec)),
        ).subscribe(
            (data) => this.xmEntityForms$.next(data),
            (error) => console.info(error),
        );
    }

    public onSpecSelect(key: FormsConfig): void {
        this.getSchemaTemplate(this.XM_TEMPLATE).pipe(
            map((tmpl) => tmpl.replace('"schema": {}', `"schema": ${key.dataSpec}`)),
            map((tmpl) => tmpl.replace('"layout": []', `"layout": ${key.dataForm}`)),
        ).subscribe((success) => this.formConfig$.next(success));
    }

    // Display the form entered by the user

    public toggleVisible(item: string): void {
        this.visible[item] = !this.visible[item];
    }

    public toggleFormOption(option: string): void {
        if (option === 'feedback') {
            this.jsonFormOptions.formDefaults.feedback =
                !this.jsonFormOptions.formDefaults.feedback;
        } else {
            this.jsonFormOptions[option] = !this.jsonFormOptions[option];
        }
        this.generateForm(this.jsonFormSchema);
    }

    private updateXmFormTemplate(spec: XmEntitySpec): FormsConfig[] {
        const xmForms = [];
        if (spec.dataSpec || spec.dataForm) {
            const dataSpec = spec.dataSpec ? spec.dataSpec : '{}';
            const dataForm = spec.dataForm ? spec.dataForm : '[]';
            const item = {key: 'dataForm', title: 'dataForm', dataSpec, dataForm};
            xmForms.push(item);
        }
        xmForms.push(...spec.functions.map((item) => this.functionSpecToFormConfig(item)));
        return xmForms;
    }

    private functionSpecToFormConfig(item: FunctionSpec): FormsConfig {
        return {
            key: item.key,
            title: item.key,
            dataSpec: item.inputSpec ? item.inputSpec : '{}',
            dataForm: item.inputForm ? item.inputForm : '[]',
        };
    }

    private getSchemaTemplate(file: any): Observable<string> {
        return this.http.get(`assets/example-schemas/${file}.json`, {responseType: 'text'});
    }

    private _filterSpec(value: string): XmEntitySpec[] {
        return this.specs
            .filter((option) => option.key.toLowerCase().startsWith(value.toLowerCase()));
    }
}
