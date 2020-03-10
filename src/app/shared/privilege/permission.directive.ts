import { Directive, EmbeddedViewRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { PermissionCheckStrategy, XmPermissionService } from './xm-permission.service';

export interface PermissionContext {
    $implicit: string[];
    permissions: string[];
    allow: boolean;
}

function permissionContextFactory(): PermissionContext {
    return {
        $implicit: null,
        permissions: null,
        allow: null,
    };
}

/**
 *
 * @Examples
 *  Primitive types:
 *  *xmPermission="undefined" // Shows template
 *  *xmPermission="null" // Shows template
 *  *xmPermission="''" // Shows template
 *  *xmPermission="true" // Shows template
 *  *xmPermission="[]" // Shows template
 *  *xmPermission="" // Shows template
 *  *xmPermission="false" // Hides template
 *
 *  *xmPermission="'RIGHT_PERMISSION'" // Shows template
 *  *xmPermission="['RIGHT_PERMISSION']" // Shows template
 *  *xmPermission="['WRONG_PERMISSION']" // Hides template
 *
 *  *xmPermission="['WRONG_PERMISSION']; else noPermittedRef" // Hides template and shows #noPermittedRef template
 *
 *  <ng-template #permittedRef>true</ng-template>
 *  <ng-template #noPermittedRef>false</ng-template>
 *  <ng-template [xmPermission]="['WRONG_PERMISSION']"
 *               [xmPermissionThen]="permittedRef"
 *               [xmPermissionElse]="noPermittedRef">
 *  // Hides #permittedRef and shows #noPermittedRef template
 *
 */
@Directive({
    selector: '[xmPermission]',
})
export class PermissionDirective {

    @Input() public strategy: PermissionCheckStrategy = PermissionCheckStrategy.ALL;
    private context: PermissionContext | null = permissionContextFactory();
    private thenTemplateRef: TemplateRef<PermissionContext> | null = null;
    private elseTemplateRef: TemplateRef<PermissionContext> | null = null;
    private thenViewRef: EmbeddedViewRef<PermissionContext> | null = null;
    private elseViewRef: EmbeddedViewRef<PermissionContext> | null = null;

    constructor(
        private viewContainer: ViewContainerRef,
        private permissionService: XmPermissionService,
        templateRef: TemplateRef<PermissionContext>,
    ) {
        this.thenTemplateRef = templateRef;
    }

    @Input()
    public set xmPermission(value: string | string[]) {
        if (!value) {
            // Show by default
            this.context.allow = true;
            this.updateView();
            return;
        }

        this.context.$implicit = this.context.permissions = Array.isArray(value) ? value : [value];
        this.validatePermissions();
    }

    @Input()
    set xmPermissionThen(templateRef: TemplateRef<PermissionContext> | null) {
        if (!templateRef || !(templateRef instanceof TemplateRef)) {
            throw new Error('Must be a TemplateRef');
        }
        this.thenTemplateRef = templateRef;
        this.thenViewRef = null;
        this.validatePermissions();
    }

    @Input()
    set xmPermissionElse(templateRef: TemplateRef<PermissionContext> | null) {
        if (!templateRef || !(templateRef instanceof TemplateRef)) {
            throw new Error('Must be a TemplateRef');
        }
        this.elseTemplateRef = templateRef;
        this.elseViewRef = null;
        this.validatePermissions();
    }

    private validatePermissions(): void {
        /*
         * TODO:
         *  1. Possible parallel requests;
         *  2. does not listen permissionService changes.
         */
        this.permissionService.hasPrivilegesBy(this.context.$implicit, this.strategy)
            .pipe(take(1))
            .subscribe((allow: boolean): void => {
                this.context.allow = allow;
                this.updateView();
            });
    }

    private updateView(): void {
        if (this.context.$implicit && this.context.allow) {
            if (!this.thenViewRef) {
                this.viewContainer.clear();
                this.elseViewRef = null;
                if (this.thenTemplateRef) {
                    this.thenViewRef = this.viewContainer.createEmbeddedView(this.thenTemplateRef, this.context);
                }
            }
        } else {
            if (!this.elseViewRef) {
                this.viewContainer.clear();
                this.thenViewRef = null;
                if (this.elseTemplateRef) {
                    this.elseViewRef = this.viewContainer.createEmbeddedView(this.elseTemplateRef, this.context);
                }
            }
        }
    }


}
