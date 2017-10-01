import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {AriChannelService} from './ari-channel.service';

@NgModule({
    providers: [
        AriChannelService
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AriChannelModule {
}
