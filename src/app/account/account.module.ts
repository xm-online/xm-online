import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageModule } from '../shared/language/language.module';

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
import { LogoutComponent } from './logout/logout.component';

@NgModule({
    imports: [
        XmSharedModule,
        RouterModule.forChild(accountState),
        LanguageModule,
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
        LogoutComponent,
    ],
    providers: [
        Activate,
        Password,
        PasswordResetInit,
        PasswordResetFinish,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class GateAccountModule {
}
