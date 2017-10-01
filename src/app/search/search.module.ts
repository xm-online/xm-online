import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { JsonSchemaFormModule } from 'angular2-json-schema-form';
import { SearchComponent } from './search.component';
import {SearchResolvePagingParams, searchRoute} from './search.routing';
import {GateSharedModule} from "../shared/shared.module";

const ENTITY_STATES = [
    ...searchRoute,
];

@NgModule({
    imports: [
        GateSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: false }),
        JsonSchemaFormModule
    ],
    declarations: [
        SearchComponent,
    ],
    entryComponents: [
        SearchComponent,
    ],
    providers: [
        SearchResolvePagingParams,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SearchModule {}
