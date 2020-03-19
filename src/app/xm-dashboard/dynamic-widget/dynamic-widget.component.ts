import {
    Compiler,
    Component,
    Injector,
    Input,
    NgModuleFactory,
    NgModuleFactoryLoader,
    NgModuleRef,
    Optional,
    ViewContainerRef,
} from '@angular/core';
import { from } from 'rxjs';

export interface IWidget<C = any, S = any> {
    config?: C;
    spec?: S;
}

export interface WidgetFn {
    new(...args: any): IWidget;
}

export interface WidgetConfig<C = any, S = any> extends IWidget<C, S> {
    module: string;
    component: string;
    config?: C;
    spec?: S;
}

export const ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND';

export type LazyComponent = NgModuleFactory<any>;

@Component({
    selector: 'xm-dynamic-widget',
    templateUrl: './dynamic-widget.component.html',
    styleUrls: ['./dynamic-widget.component.scss'],
})
export class DynamicWidgetComponent {

    public commons: string[] = ['ext-common', 'ext-common-csp', 'ext-common-entity'];

    constructor(private loader: NgModuleFactoryLoader,
                private injector: Injector,
                @Optional() private compiler: Compiler,
                private viewRef: ViewContainerRef) {
    }

    @Input()
    public set init(value: WidgetConfig) {
        if (!value) {
            return;
        }
        const modulePath = this.resolveModulePath(value.module);
        const moduleFactory = from(this.loader.load(modulePath));

        moduleFactory.subscribe((factory) => {
            const module = factory.create(this.injector);
            const componentTypeOrLazyComponentType = module.injector.get(value.component, ELEMENT_NOT_FOUND);

            if (componentTypeOrLazyComponentType === ELEMENT_NOT_FOUND) {
                // eslint-disable-next-line no-console
                console.error(`ERROR: The "${value.component}" does not exist in the "${value.module}" module!`);
                return;
            }

            if (componentTypeOrLazyComponentType instanceof Promise) {
                this.createLazyComponent(value, componentTypeOrLazyComponentType, module.injector);
            } else {
                this.createComponent(value, module, componentTypeOrLazyComponentType);
            }
        });
    }

    private resolveModulePath(module: string): string {
        const rootClass = module.split('-').map((e) => e[0].toUpperCase() + e.slice(1)).join('');
        const extName = module.split('-').reverse()[0];
        const extRootClass = `${extName.charAt(0).toUpperCase() + extName.slice(1)}WebappExtModule`;
        let modulePath: string;
        // eslint-disable-next-line @typescript-eslint/prefer-includes
        if (this.commons.indexOf(module) > -1) {
            modulePath = `src/app/ext-commons/${module}/${module}.module#${rootClass}Module`;
        } else {
            modulePath = `src/app/ext/${extName}-webapp-ext/module/${extName}-webapp-ext.module#${extRootClass}`;
        }

        return modulePath;
    }

    private async createLazyComponent<T>(
        value: WidgetConfig,
        lazy: Promise<LazyComponent>,
        injector: Injector,
    ): Promise<void> {
        const module = await lazy;

        let moduleFactory;
        if (module instanceof NgModuleFactory) {
            // For AOT
            moduleFactory = module;
        } else {
            // For JIT
            moduleFactory = await this.compiler.compileModuleAsync(module);
        }
        const entryComponent = moduleFactory.moduleType.entry;

        if (!entryComponent) {
            // eslint-disable-next-line no-console
            console.error(`ERROR: the "${value.module}" module expected to have a "static entry" filed!`
                + 'E.g. static entry = YourComponent;');
            return;
        }

        const activeModule = moduleFactory.create(injector);
        this.createComponent(value, activeModule, entryComponent);
    }

    private createComponent<T>(value: WidgetConfig, module: NgModuleRef<T>, entryComponentType: WidgetFn): void {
        const componentFactory = module.componentFactoryResolver.resolveComponentFactory(entryComponentType);
        const widget = this.viewRef.createComponent<IWidget>(componentFactory);
        widget.instance.config = value.config;
        widget.instance.spec = value.spec;
    }
}
