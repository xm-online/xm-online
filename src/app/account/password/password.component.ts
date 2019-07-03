import { Component, OnInit } from '@angular/core';

import { Principal } from '../../shared';
import { Password } from './password.service';
import { ChangePassword } from './password.model';
import { PasswordSpec } from '../../xm-entity/shared/password-spec.model';
import { XmConfigService } from '../../shared/spec/config.service';

@Component({
    selector: 'xm-password',
    templateUrl: './password.component.html',
    styleUrls: ['./password.component.scss']
})
export class PasswordComponent implements OnInit {

    isShowPassword = false;
    isShowNewPassword = false;
    doNotMatch: string;
    error: string;
    success: string;
    account: any;
    password: ChangePassword;
    passwordSettings: PasswordSpec;
    patternMessage: string;

    constructor(
        private passwordService: Password,
        private xmConfigService: XmConfigService,
        private principal: Principal
    ) {
        this.password = new ChangePassword();
    }

    ngOnInit() {
        this.principal.identity().then((account) => {
            this.account = account;

            this.xmConfigService
                .getPasswordConfig()
                .subscribe((config: any) => {
                    this.makePasswordSettings(config);
                }, err => this.makePasswordSettings());
        });
    }

    changePassword() {
        if (this.password.newPassword !== this.password.confirmNewPassword) {
            this.error = null;
            this.success = null;
            this.doNotMatch = 'ERROR';
        } else {
            this.doNotMatch = null;
            this.passwordService.save(this.password).subscribe(() => {
                this.error = null;
                this.success = 'OK';
            }, () => {
                this.success = null;
                this.error = 'ERROR';
            });
        }
    }

    private makePasswordSettings(config?: any): void {
        this.passwordSettings = this.xmConfigService.mapPasswordSettings(config);
        if (this.passwordSettings.patternMessage) {
            this.patternMessage = this.xmConfigService.updatePatternMessage(this.passwordSettings.patternMessage)
        }
    }
}
