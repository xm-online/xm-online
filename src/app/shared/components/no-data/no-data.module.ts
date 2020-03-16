import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmSharedModule } from '@xm-ngx/shared';
import { NoDataComponent } from './no-data.component';

@NgModule({
    declarations: [NoDataComponent],
    exports: [NoDataComponent],
    imports: [
        XmSharedModule,
        CommonModule,
    ],
})
export class NoDataModule {
}
