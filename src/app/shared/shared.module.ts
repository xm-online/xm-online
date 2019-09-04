import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CookieService, CookieOptions } from 'angular2-cookie/core';
import { ReCaptchaModule } from 'angular2-recaptcha';
import { MarkdownModule } from 'ngx-markdown';
import { CovalentTextEditorModule } from '@covalent/text-editor';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import {
    AccountService,
    AuthServerProvider,
    AuthService,
    ClientService,
    ContextService,
    CSRFService,
    FocusDirective,
    HasAnyAuthorityDirective,
    InputPreventPasteDirective,
    I18nJsfPipe,
    I18nNamePipe,
    JhiSocialComponent,
    LoaderComponent,
    LoginComponent,
    LoginService,
    NoDataComponent,
    PoweredByComponent,
    MaintenanceComponent,
    ParseByPathService,
    PermitDirective,
    PerPageComponent,
    PrivilegeService,
    RegisterComponent,
    RegisterService,
    StateStorageService,
    UserLoginFormComponent,
    UserLoginService,
    UserService,
    WordAutocompleteDirective,
    XmConfigService,
    XmConfirmDialogComponent,
    XmPasswordNeededComponent,
    XmPrivilegeDirective,
    XmGMapApiInitDirective
} from './';
import { PrivacyAndTermsDialogComponent } from './components/privacy-and-terms-dialog/privacy-and-terms-dialog.component';
import { AceEditorDirective } from './directives/ace-editor.directive';
import { SafeNamePipe } from './helpers/safe-name.pipe';
import { XmDateTimePipe } from './helpers/xm-date-time.pipe';
import { XmEntityStateSpecPipe } from './helpers/xm-entity-state-spec.pipe';
import { MultilingualInputComponent } from './jsf-extention/widgets/multilingual-input/multilingual-input.component';
import { DatetimeUtcComponent } from './jsf-extention/widgets/datetime-utc/datetime-utc.component';
import { DatetimePickerComponent } from './jsf-extention/widgets/datetime-picker/datetime-picker.component';
import { EmailMatcherComponent } from './jsf-extention/widgets/email-matcher/email-matcher.component';
import { TextSectionComponent } from './jsf-extention/widgets/text-section/text-section.component';
import { CurrentLocationComponent } from './jsf-extention/widgets/current-location/current-location.component';
import { ExtAutocompleteService } from './jsf-extention/widgets/ext-autocomplete/ext-autocomplete-service';
import { ExtAutocompleteComponent } from './jsf-extention/widgets/ext-autocomplete/ext-autocomplete.component';
import { ExtMultiSelectComponent } from './jsf-extention/widgets/ext-multi-select/ext-multi-select.component';
import { ExtQuerySelectComponent } from './jsf-extention/widgets/ext-query-select/ext-query-select.component';
import { ExtSelectService } from './jsf-extention/widgets/ext-select/ext-select-service';
import { ExtSelectComponent } from './jsf-extention/widgets/ext-select/ext-select.component';
import { ExtMdEditorComponent } from './jsf-extention/widgets/ext-md-editor/ext-md-editor.component';
import { ExtTextareaComponent } from './jsf-extention/widgets/ext-textarea/ext-textarea.component';
import { FileUploadComponent } from './jsf-extention/widgets/file-upload/file-upload.component';
import { PasswordStrengthBarComponent } from './password-strength-bar/password-strength-bar.component';
import { RoleService } from './role/role.service';
import { GateSharedCommonModule } from './shared-common.module';
import { GateSharedLibsModule } from './shared-libs.module'
import { MatModule } from '../mat.module';
import { ValidationComponent } from './jsf-extention/widgets/validation-component/validation-component.component';
import { XmCondition } from './helpers/xm-condition';
import { DigitOnlyDirective } from './directives/digit-only.directive';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
    imports: [
        GateSharedLibsModule,
        GateSharedCommonModule,
        ReCaptchaModule,
        MarkdownModule.forChild(),
        MatModule,
        CovalentTextEditorModule,
        OwlDateTimeModule,
        GooglePlaceModule,
        OwlNativeDateTimeModule,
        TranslateModule
    ],
    declarations: [
        AceEditorDirective,
        JhiSocialComponent,
        LoginComponent,
        RegisterComponent,
        HasAnyAuthorityDirective,
        I18nNamePipe,
        I18nJsfPipe,
        SafeNamePipe,
        XmCondition,
        XmEntityStateSpecPipe,
        XmDateTimePipe,
        UserLoginFormComponent,
        LoaderComponent,
        WordAutocompleteDirective,
        FocusDirective,
        InputPreventPasteDirective,
        DigitOnlyDirective,
        PerPageComponent,
        NoDataComponent,
        PoweredByComponent,
        MaintenanceComponent,
        PermitDirective,
        XmPrivilegeDirective,
        XmGMapApiInitDirective,
        PasswordStrengthBarComponent,
        XmPasswordNeededComponent,
        XmConfirmDialogComponent,
        CurrentLocationComponent,
        ExtSelectComponent,
        ValidationComponent,
        ExtAutocompleteComponent,
        ExtMultiSelectComponent,
        ExtQuerySelectComponent,
        ExtTextareaComponent,
        ExtMdEditorComponent,
        MultilingualInputComponent,
        DatetimeUtcComponent,
        DatetimePickerComponent,
        EmailMatcherComponent,
        TextSectionComponent,
        FileUploadComponent,
        PrivacyAndTermsDialogComponent
    ],
    entryComponents: [
        LoginComponent,
        RegisterComponent,
        UserLoginFormComponent,
        PasswordStrengthBarComponent,
        CurrentLocationComponent,
        ExtSelectComponent,
        ExtAutocompleteComponent,
        ExtMultiSelectComponent,
        ExtQuerySelectComponent,
        ValidationComponent,
        ExtTextareaComponent,
        ExtMdEditorComponent,
        MultilingualInputComponent,
        DatetimeUtcComponent,
        DatetimePickerComponent,
        EmailMatcherComponent,
        TextSectionComponent,
        FileUploadComponent,
        PrivacyAndTermsDialogComponent
    ],
    providers: [
        CookieService,
        { provide: CookieOptions, useValue: {} },
        ContextService,
        LoginService,
        RegisterService,
        AccountService,
        StateStorageService,
        CSRFService,
        AuthServerProvider,
        AuthService,
        UserService,
        ClientService,
        ExtSelectService,
        ExtAutocompleteService,
        UserLoginService,
        DatePipe,
        I18nNamePipe,
        I18nJsfPipe,
        SafeNamePipe,
        XmCondition,
        XmDateTimePipe,
        RoleService,
        PrivilegeService,
        ParseByPathService,
        PasswordStrengthBarComponent,
        XmConfigService
    ],
    exports: [
        AceEditorDirective,
        GateSharedCommonModule,
        JhiSocialComponent,
        LoginComponent,
        UserLoginFormComponent,
        RegisterComponent,
        HasAnyAuthorityDirective,
        DatePipe,
        I18nNamePipe,
        I18nJsfPipe,
        SafeNamePipe,
        XmCondition,
        XmEntityStateSpecPipe,
        XmDateTimePipe,
        LoaderComponent,
        PerPageComponent,
        NoDataComponent,
        PoweredByComponent,
        MaintenanceComponent,
        WordAutocompleteDirective,
        FocusDirective,
        InputPreventPasteDirective,
        DigitOnlyDirective,
        PermitDirective,
        XmPrivilegeDirective,
        XmGMapApiInitDirective,
        PasswordStrengthBarComponent,
        XmPasswordNeededComponent,
        XmConfirmDialogComponent,
        CurrentLocationComponent,
        ExtSelectComponent,
        ExtAutocompleteComponent,
        ExtMultiSelectComponent,
        ExtQuerySelectComponent,
        ValidationComponent,
        ExtTextareaComponent,
        ExtMdEditorComponent,
        MultilingualInputComponent,
        MatModule,
        DatetimeUtcComponent,
        DatetimePickerComponent,
        EmailMatcherComponent,
        TextSectionComponent,
        FileUploadComponent,
        GooglePlaceModule,
        TranslateModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class XmSharedModule {
}
