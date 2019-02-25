import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

import {
    Activate,
    Password,
    PasswordResetInit,
    PasswordResetFinish,
    SignUpComponent,
    ActivateComponent,
    PasswordComponent,
    PasswordResetInitComponent,
    PasswordResetFinishComponent,
    SettingsComponent,
    SocialRegisterComponent,
    SocialAuthComponent,
} from './';
import {accountState} from './account.route';
import {XmSharedModule} from '../shared/shared.module';


@NgModule({
    imports: [
        XmSharedModule,
        RouterModule.forRoot(accountState, { useHash: false })
    ],
    declarations: [
        SocialRegisterComponent,
        SocialAuthComponent,
        ActivateComponent,
        SignUpComponent,
        PasswordComponent,
        PasswordResetInitComponent,
        PasswordResetFinishComponent,
        SettingsComponent
    ],
    providers: [
        Activate,
        Password,
        PasswordResetInit,
        PasswordResetFinish,
        NgbActiveModal
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GateAccountModule {}
