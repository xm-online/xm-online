import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {DatePipe} from '@angular/common';
import {CookieService} from 'angular2-cookie/services/cookies.service';

import {
    CSRFService, AuthService, AuthServerProvider, AccountService,
    UserService, XmEntitySpecService, TenantService, StateStorageService, LoginService, RegisterService, Principal,
    HasAnyAuthorityDirective, JhiSocialComponent, SocialService, LoginComponent, RegisterComponent, I18nNamePipe,
    UserLoginService, UserLoginFormComponent
} from './';
import {GateSharedLibsModule} from "./shared-libs.module";
import {GateSharedCommonModule} from "./shared-common.module";
import {CustomTranslatePartialLoader} from './language/language.loader';
import {ReCaptchaModule} from 'angular2-recaptcha';

@NgModule({
    imports: [
        GateSharedLibsModule,
        GateSharedCommonModule,
        ReCaptchaModule
    ],
    declarations: [
        JhiSocialComponent,
        LoginComponent,
        RegisterComponent,
        HasAnyAuthorityDirective,
        I18nNamePipe,
        UserLoginFormComponent
    ],
    providers: [
        CookieService,
        LoginService,
        RegisterService,
        AccountService,
        StateStorageService,
        Principal,
        CSRFService,
        AuthServerProvider,
        SocialService,
        AuthService,
        UserService,
        UserLoginService,
        XmEntitySpecService,
        TenantService,
        DatePipe,
        CustomTranslatePartialLoader,
        I18nNamePipe,
    ],
    entryComponents: [
        LoginComponent,
        RegisterComponent,
        UserLoginFormComponent
    ],
    exports: [
        GateSharedCommonModule,
        JhiSocialComponent,
        LoginComponent,
        UserLoginFormComponent,
        RegisterComponent,
        HasAnyAuthorityDirective,
        DatePipe,
        I18nNamePipe
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class GateSharedModule {
}
