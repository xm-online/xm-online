import {Component, OnInit} from '@angular/core';
import {XmEntitySpecWrapperService} from '../shared/xm-entity-spec-wrapper.service';
import {Observable, Subject} from 'rxjs';
import {NextSpec, XmEntitySpec} from '..';
import {FormControl} from '@angular/forms';
import {map, startWith, tap} from 'rxjs/operators';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'xm-states-management-dialog',
    templateUrl: './states-management-dialog.component.html',
    styleUrls: ['./states-management-dialog.component.scss']
})

export class StatesManagementDialogComponent implements OnInit {
    specs$: Observable<XmEntitySpec[]>;
    specs: XmEntitySpec[] = [];

    selectedSpec: string;
    selectedSpecKey$ = new Subject<string>();
    formSpecSearch: FormControl;
    filteredSpecOptions$: Observable<XmEntitySpec[]>;
    ratioSpec$: any;

    constructor(
        private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
        private activeModal: NgbActiveModal
    ) {
    }

    ngOnInit(): void {
        this.specs$ = this.xmEntitySpecWrapperService.specv2()
            .pipe(
                map(specs => specs.types),
                map(specs => specs.filter(eSpecs => eSpecs.states && eSpecs.states.length)),
                tap((specs) => this.specs = specs)
            );

        this.formSpecSearch = new FormControl();
        this.filteredSpecOptions$ = this.formSpecSearch.valueChanges
            .pipe(
                startWith(''),
                map(value => this._filterSpec(value))
            );

        this.ratioSpec$ = this.selectedSpecKey$.asObservable()
            .pipe(
                map(specKey => this.specs.filter(spec => spec.key === specKey).shift()),
                map(spec => spec.states),
                map(states => {
                    const ratioSpec = states
                        .map((state, i, arr) => {
                            state.next = state.next || [];

                            return states
                                .map(eState => eState.key)
                                .map((key, n) => {
                                    if (n === i) {
                                        return 'active'
                                    }
                                    const nextState: NextSpec = state.next.find(next => next.stateKey === key);
                                    if (nextState) {
                                        return Object.assign({}, arr.filter(eState => eState.key === nextState.stateKey).shift(), nextState)
                                    } else {
                                        return 'empty'
                                    }
                                })
                        })
                        .map((state, i) => {
                            state.unshift(states[i]);
                            return state;
                        });

                    ratioSpec.unshift(['empty', ...states]);
                    return ratioSpec
                })
            )
    }

    private _filterSpec(value: string): XmEntitySpec[] {
        return this.specs
            .filter(option => option.key.toLowerCase().indexOf(value.toLowerCase()) === 0);
    }

    onSaveSelectedSpecKey(value: string) {
        this.selectedSpecKey$.next(value)
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }
}
