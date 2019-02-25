import {Directive, Input, TemplateRef, ViewContainerRef, OnDestroy} from '@angular/core';
import {Principal} from '../auth/principal.service';
import {Subscription} from 'rxjs';

/**
 * @whatItDoes Conditionally includes an HTML element if current user has any
 * of the authorities passed as the `expression`.
 *
 * @howToUse
 * ```
 *     <some-element *permitted="'RATING.UPDATE'">...</some-element>
 *
 *     <some-element *permitted="['RATING.UPDATE', 'TENANT.LOGIN.GET_LIST']">...</some-element>
 * ```
 */

@Directive({
    selector: '[permitted]'
})
export class PermitDirective implements OnDestroy {

    privileges: string[];
    private privilegeSubscription: Subscription;

    constructor(
        private principal: Principal,
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
    ) {
    }

    @Input()
    set permitted(value: string) {
        this.privileges = typeof value === 'string' ? [ <string> value ] : <string[]> value;
        this.updateView();
        // Get notified each time authentication state changes.
        this.privilegeSubscription = this.principal.getAuthenticationState().subscribe((identity) => this.updateView());
    }

    private updateView(): void {
        this.principal.hasPrivileges(this.privileges).then((result) => {
            this.viewContainerRef.clear();
            if (result) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
        });
    }

    ngOnDestroy() {
        this.privilegeSubscription.unsubscribe();
    }

}
