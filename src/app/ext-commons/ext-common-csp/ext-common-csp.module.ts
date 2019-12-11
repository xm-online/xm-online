import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { XmSharedModule } from '../../shared/shared.module';
import { PhoneNumberChoiceWidgetComponent } from './phone-number-choice-widget/phone-number-choice-widget.component';

@NgModule({
    imports: [
        CommonModule,
        XmSharedModule,
    ],
    declarations: [
        PhoneNumberChoiceWidgetComponent,
    ],
    entryComponents: [
        PhoneNumberChoiceWidgetComponent,
    ],
    providers: [
        {
            provide: 'phone-number-choice-widget', useValue: PhoneNumberChoiceWidgetComponent,
        },
    ],
})
export class ExtCommonCspModule {
}
