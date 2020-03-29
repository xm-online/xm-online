/* eslint-disable @typescript-eslint/prefer-string-starts-ends-with */
import { Component, NgModule, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { NoDataModule } from '@xm-ngx/components/no-data';
import { EntityStateModule } from '@xm-ngx/entity/entity-state';
import { XmSharedModule } from '@xm-ngx/shared';

import { Observable, Subject } from 'rxjs';
import { map, startWith, tap } from 'rxjs/operators';
import { NextSpec, XmEntitySpec } from '..';
import { XmEntitySpecWrapperService } from '../shared/xm-entity-spec-wrapper.service';

@Component({
    selector: 'xm-states-management-dialog',
    templateUrl: './states-management-dialog.component.html',
    styleUrls: ['./states-management-dialog.component.scss'],
})

export class StatesManagementDialogComponent implements OnInit {
    public specs$: Observable<XmEntitySpec[]>;
    public specs: XmEntitySpec[] = [];

    public selectedSpec: string;
    public selectedSpecKey$: Subject<string> = new Subject<string>();
    public formSpecSearch: FormControl;
    public filteredSpecOptions$: Observable<XmEntitySpec[]>;
    public ratioSpec$: any;

    constructor(
        private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
        private activeModal: MatDialogRef<StatesManagementDialogComponent>,
    ) {
    }

    public ngOnInit(): void {
        this.specs$ = this.xmEntitySpecWrapperService.specv2()
            .pipe(
                map((specs) => specs.types),
                map((specs) => specs.filter((eSpecs) => eSpecs.states && eSpecs.states.length)),
                tap((specs) => this.specs = specs),
            );

        this.formSpecSearch = new FormControl();
        this.filteredSpecOptions$ = this.formSpecSearch.valueChanges
            .pipe(
                startWith(''),
                map((value) => this._filterSpec(value)),
            );

        this.ratioSpec$ = this.selectedSpecKey$.asObservable()
            .pipe(
                map((specKey) => this.specs.filter((spec) => spec.key === specKey).shift()),
                map((spec) => spec.states),
                map((states) => {
                    const ratioSpec = states
                        .map((state, i, arr) => {
                            state.next = state.next || [];

                            return states
                                .map((eState) => eState.key)
                                .map((key, n) => {
                                    if (n === i) {
                                        return 'active';
                                    }
                                    const nextState: NextSpec = state.next.find((next) => next.stateKey === key);
                                    if (nextState) {
                                        return Object.assign(
                                            {},
                                            arr.filter((eState) => eState.key === nextState.stateKey).shift(),
                                            nextState);
                                    } else {
                                        return 'empty';
                                    }
                                });
                        })
                        .map((state, i) => {
                            state.unshift(states[i]);
                            return state;
                        });

                    ratioSpec.unshift(['empty', ...states]);
                    return ratioSpec;
                }),
            );
    }

    public onSaveSelectedSpecKey(value: string): void {
        this.selectedSpecKey$.next(value);
    }

    public onCancel(): void {
        this.activeModal.close(false);
    }

    private _filterSpec(value: string): XmEntitySpec[] {
        return this.specs
            .filter((option) => option.key.toLowerCase().indexOf(value.toLowerCase()) === 0);
    }
}

@NgModule({
    imports: [XmSharedModule, NoDataModule, EntityStateModule],
    exports: [StatesManagementDialogComponent],
    declarations: [StatesManagementDialogComponent],
    entryComponents: [StatesManagementDialogComponent],
    providers: [],
})
export class StatesManagementDialogModule {
}
