import {Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, OnInit, AfterContentInit} from '@angular/core';
import {Principal} from '../auth/principal.service';
import {Subscription} from 'rxjs';

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
 *     <some-element *xmPermitted="['COMMENTS.DELETE', 'COMMENTS.CREATE']; context: contextResolver()">...</some-element>
 * ```
 * where contextResolver is a function that returns a function from component controller
 * ```
 * contextResolver(): Function {
 *   return () => {return true/false}
 * }
 * ```
 */

@Directive({
    selector: '[xmPermitted]'
})
export class XmPrivilegeDirective implements OnInit, OnDestroy, AfterContentInit {

    private privilegeSubscription: Subscription;

    @Input() xmPermitted: string[] = [];

    @Input() xmPermittedContext: Function = () => {return true};

    constructor(
        private principal: Principal,
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
    ) {
    }

    ngOnInit() {
        this.privilegeSubscription = this.principal.getAuthenticationState().subscribe((identity) => this.updateView());
    }

    private updateView(): void {
        this.principal.hasPrivileges(this.xmPermitted).then((result) => {
            this.viewContainerRef.clear();
            if (result && this.xmPermittedContext()) {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
        });
    }

    ngOnDestroy() {
        this.privilegeSubscription ? this.privilegeSubscription.unsubscribe() : console.log('no privilegeSubscription');
    }

    ngAfterContentInit() {
        this.updateView();
    }

}
