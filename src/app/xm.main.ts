import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { ProdConfig } from './blocks/config/prod.config';
import { XmModule } from './xm.module';

ProdConfig();

if ((module as any).hot) {
    (module as any).hot.accept();
}

platformBrowserDynamic().bootstrapModule(XmModule);
