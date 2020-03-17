import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {XmRibbonComponent} from './xm-ribbon.component';

@NgModule({
    declarations: [XmRibbonComponent],
    exports: [XmRibbonComponent],
    imports: [CommonModule],
})
export class XmRibbonModule {
}
