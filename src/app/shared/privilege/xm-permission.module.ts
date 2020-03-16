import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PermissionDirective } from './permission.directive';
import { PermitDirective } from './privilege.directive';
import { XmPrivilegeDirective } from './xmPrivilege.directive';

@NgModule({
    declarations: [PermissionDirective, PermitDirective, XmPrivilegeDirective],
    exports: [PermissionDirective, PermitDirective, XmPrivilegeDirective],
    imports: [
        CommonModule,
    ],
})
export class XmPermissionModule {
}
