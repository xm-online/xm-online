import { Component, Injector, Input, NgModuleFactoryLoader, OnInit, ViewContainerRef } from '@angular/core';
import { from as fromPromise } from 'rxjs';

@Component({
    selector: 'xm-dynamic-widget',
    templateUrl: './dynamic-widget.component.html',
    styleUrls: ['./dynamic-widget.component.scss']
})
export class DynamicWidgetComponent implements OnInit {

    commons: string[] = ['ext-common', 'ext-common-csp', 'ext-common-entity'];

    @Input() set init(value) {
        if (!value) {
            return;
        }
        const rootClass = value.module.split('-').map(e => e[0].toUpperCase() + e.slice(1)).join('');
        const extName = value.module.split('-').reverse()[0];
        const extRootClass = extName.charAt(0).toUpperCase() + extName.slice(1) + 'WebappExtModule';
        let modulePath: string;
        if (this.commons.indexOf(value.module) > -1) {
            modulePath = `src/app/ext-commons/${value.module}/${value.module}.module#${rootClass}Module`;
        } else {
            modulePath = `src/app/ext/${extName}-webapp-ext/module/${extName}-webapp-ext.module#${extRootClass}`;
        }
        const moduleFactory = fromPromise(this.loader.load(modulePath));
        moduleFactory.subscribe(factory => {
            const module = factory.create(this.injector);
            const entryComponentType = module.injector.get(value.component);
            const componentFactory = module.componentFactoryResolver.resolveComponentFactory(entryComponentType);
            const widget = this.viewRef.createComponent(componentFactory);
            widget.instance['config'] = value.config;
            widget.instance['spec'] = value.spec;
        });
    }

    constructor(private loader: NgModuleFactoryLoader,
                private injector: Injector,
                private viewRef: ViewContainerRef) {
    }

    ngOnInit() {
    }

}
