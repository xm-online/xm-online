import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { XmModule } from './app/xm.module';
import { environment } from './environments/environment';
import './rxjs-extensions';

if (environment.production) {
    enableProdMode();
}

platformBrowserDynamic().bootstrapModule(XmModule);
