import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
    Framework,
    FrameworkLibraryService,
    JsonSchemaFormModule,
    JsonSchemaFormService,
    MaterialDesignFramework,
    MaterialDesignFrameworkModule,
    WidgetLibraryService,
} from 'angular2-json-schema-form';

const _JsonSchemaFormModule = {
    ngModule: JsonSchemaFormModule,
    providers: [
        JsonSchemaFormService,
        FrameworkLibraryService,
        WidgetLibraryService,
        {provide: Framework, useClass: MaterialDesignFramework, multi: true},
    ],
};

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        MaterialDesignFrameworkModule,
        _JsonSchemaFormModule,
    ],
    exports: [
        MaterialDesignFrameworkModule,
        JsonSchemaFormModule,
    ],
})
export class XmJsonSchemeFormModule {
}
