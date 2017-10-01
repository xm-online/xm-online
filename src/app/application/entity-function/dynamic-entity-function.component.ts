import {Component, Input, ViewContainerRef, ViewChild, ReflectiveInjector, ComponentFactoryResolver} from '@angular/core';
import {EntityDefaultFunctionComponent} from './dynamic-default-entity-function.component';
import {LinkedinProfileComponent} from './extract-linkedin-profile/linkedin-profile.component';
import {RedeemVoucherComponent} from './redeem-voucher/redeem-voucher.component';
import { AreaSquareComponent } from './area-square/area-square.component';

@Component({
    selector: 'xm-dynamic-function-cmp',
    entryComponents: [
        EntityDefaultFunctionComponent,
        LinkedinProfileComponent,
        RedeemVoucherComponent,
        AreaSquareComponent,
    ], // Reference to the components must be here in order to dynamically create them
    template: `
        <div #dynamicContainer></div>
    `,
})
export default class EntityDynamicFunctionComponent {

    currentComponent = null;

    @ViewChild('dynamicContainer', { read: ViewContainerRef }) dynamicContainer: ViewContainerRef;

    // component: Class for the component you want to create
    // inputs: An object with key/value pairs mapped to input name/input value
    @Input() set functionData(data: {component: any, inputs: any }) {
        if (!data) {
            return;
        }

        // Inputs need to be in the following format to be resolved properly
        let inputProviders = Object.keys(data.inputs).map((inputName) => {return {provide: inputName, useValue: data.inputs[inputName]};});
        let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

        // We create an injector out of the data we want to pass down and this components injector
        let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicContainer.parentInjector);

        // We create a factory out of the component we want to create
        let factory = this.resolver.resolveComponentFactory(data.component || EntityDefaultFunctionComponent);

        // We create the component using the factory and the injector
        let component = factory.create(injector);

        // We insert the component into the dom container
        this.dynamicContainer.insert(component.hostView);

        // We can destroy the old component is we like by calling destroy
        if (this.currentComponent) {
            this.currentComponent.destroy();
        }

        this.currentComponent = component;
    }

    constructor(
        private resolver: ComponentFactoryResolver
    ) {

    }
}
