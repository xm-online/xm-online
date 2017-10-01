import {Component, Input, ViewContainerRef, ViewChild, ReflectiveInjector, ComponentFactoryResolver} from '@angular/core';
import {
  XmWidgetDefaultComponent,
  XmWidgetAvailableOfferingsComponent,
  XmWidgetGeneralMapComponent,
  XmWidgetStatsComponent,
  XmWidgetTasksComponent,
  XmWidgetWeatherComponent,
  XmWidgetClockComponent,
  XmWidgetGeneralCountriesComponent,
  XmWidgetMttEarthComponent,
  XmWidgetExchangeComponent,
  XmWidgetMdComponent,
  XmWidgetActiveCallsComponent,
  XmWidgetLotsComponent,
  XmWidgetWelcomeComponent,
  XmWidgetEntitiesListComponent,
} from '../';

@Component({
  selector: 'dynamic-widget',
  entryComponents: [
    XmWidgetDefaultComponent,
    XmWidgetAvailableOfferingsComponent,
    XmWidgetGeneralMapComponent,
    XmWidgetStatsComponent,
    XmWidgetTasksComponent,
    XmWidgetWeatherComponent,
    XmWidgetClockComponent,
    XmWidgetGeneralCountriesComponent,
    XmWidgetMttEarthComponent,
    XmWidgetExchangeComponent,
    XmWidgetMdComponent,
    XmWidgetActiveCallsComponent,
    XmWidgetLotsComponent,
    XmWidgetWelcomeComponent,
    XmWidgetEntitiesListComponent,
  ], // Reference to the components must be here in order to dynamically create them
  template: `
    <div #dynamicWidgetContainer></div>
  `,
})
export class DynamicWidget {
  currentComponent = null;

  @ViewChild('dynamicWidgetContainer', { read: ViewContainerRef }) dynamicWidgetContainer: ViewContainerRef;

  // component: Class for the component you want to create
  // inputs: An object with key/value pairs mapped to input name/input value
  @Input() set widgetData(data: {component: any, inputs: any }) {
    if (!data) {
      return;
    }

    // Inputs need to be in the following format to be resolved properly
    let inputProviders = Object.keys(data.inputs).map((inputName) => {return {provide: inputName, useValue: data.inputs[inputName]};});
    let resolvedInputs = ReflectiveInjector.resolve(inputProviders);

    // We create an injector out of the data we want to pass down and this components injector
    let injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.dynamicWidgetContainer.parentInjector);

    // We create a factory out of the component we want to create
    let factory = this.resolver.resolveComponentFactory(data.component || XmWidgetDefaultComponent);

    // We create the component using the factory and the injector
    let component = factory.create(injector);

    // We insert the component into the dom container
    this.dynamicWidgetContainer.insert(component.hostView);

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
