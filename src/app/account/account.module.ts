import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageHelper, ModulesLanguageHelper } from '../shared';

import { XmSharedModule } from '../shared/shared.module';
import {
    Activate,
    ActivateComponent,
    Password,
    PasswordComponent,
    PasswordResetFinish,
    PasswordResetFinishComponent,
    PasswordResetInit,
    PasswordResetInitComponent,
    SettingsComponent,
    SignUpComponent,
    SocialAuthComponent,
    SocialRegisterComponent,
} from './';
import { accountState } from './account.route';

@NgModule({
    imports: [
        XmSharedModule,
        RouterModule.forChild(accountState),
    ],
    declarations: [
        SocialRegisterComponent,
        SocialAuthComponent,
        ActivateComponent,
        SignUpComponent,
        PasswordComponent,
        PasswordResetInitComponent,
        PasswordResetFinishComponent,
        SettingsComponent,
    ],
    providers: [
        Activate,
        Password,
        PasswordResetInit,
        PasswordResetFinish,
        NgbActiveModal,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GateAccountModule {
    constructor(private modulesLangHelper: ModulesLanguageHelper, private languageHelper: JhiLanguageHelper) {
        this.languageHelper
            .language
            .subscribe((languageKey: string) => {this.modulesLangHelper.correctLang(languageKey); });
    }
}
