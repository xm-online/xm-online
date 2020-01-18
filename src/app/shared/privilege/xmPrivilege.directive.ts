/* tslint:disable:member-ordering */
import { AfterContentInit, Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { Principal } from '../auth/principal.service';

/**
 * @Purpose Conditionally includes an HTML element if current user has any
 * of xmPermitted AND if xmPermittedContext (optional) evaluated as True.
 *
 * xmPermittedContext is a call back function that evaluates state of component and provides true/false answer.
 *
 * @howToUse
 * ```
 *     <some-element *xmPermitted="['COMMENTS.DELETE']">...</some-element>
 *     <some-element *xmPermitted="['COMMENTS.DELETE', 'COMMENTS.CREATE']">...</some-element>
 *     <some-element *xmPermitted="['COMMENTS.DELETE', 'COMMENTS.CREATE']; context: contextResolver()"></some-element>
 * ```
 * where contextResolver is a function that returns a function from component controller
 * ```
 * contextResolver(): Function {
 *   return () => {return true/false}
 * }
 * ```
 */

@Directive({
    selector: '[xmPermitted]',
})
export class XmPrivilegeDirective implements OnInit, OnDestroy, AfterContentInit {

    @Input() public xmPermitted: string[] = [];
    @Input() public xmPermittedContext: () => boolean = () => true;
    private privilegeSubscription: Subscription;

    constructor(private principal: Principal,
                private templateRef: TemplateRef<any>,
                private viewContainerRef: ViewContainerRef,
    ) {
    }

    public ngOnInit(): void {
        this.privilegeSubscription = this.principal.getAuthenticationState()
            .subscribe((identity) => this.updateView());
    }

    public ngOnDestroy(): void {
        // eslint-disable-next-line no-unused-expressions
        this.privilegeSubscription
            ? this.privilegeSubscription.unsubscribe()
            : console.info('no privilegeSubscription');
    }

    public ngAfterContentInit(): void {
        this.updateView();
    }

    private updateView(): void {
        this.principal.hasPrivileges(this.xmPermitted).then((result) => {
            this.viewContainerRef.clear();
            if (result && this.xmPermittedContext()) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
        });
    }

}
