import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmSharedModule } from '@xm-ngx/shared';
import { LoaderModule } from '@xm-ngx/components/loader';
import { XmPasswordNeededComponent } from './xm-password-needed.component';

@NgModule({
    declarations: [XmPasswordNeededComponent],
    exports: [XmPasswordNeededComponent],
    imports: [
        LoaderModule,
        CommonModule,
        XmSharedModule,
    ],
})
export class XmPasswordNeededModule {
}
