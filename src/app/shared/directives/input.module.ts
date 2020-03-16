import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InputPatternDirective } from './input-pattern.directive';

@NgModule({
    declarations: [InputPatternDirective],
    exports: [InputPatternDirective],
    imports: [
        CommonModule,
    ],
})
export class InputModule {
}
