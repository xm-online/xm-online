import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoaderComponent } from './loader.component';

@NgModule({
    declarations: [LoaderComponent],
    exports: [LoaderComponent],
    imports: [CommonModule],
})
export class LoaderModule {
}
