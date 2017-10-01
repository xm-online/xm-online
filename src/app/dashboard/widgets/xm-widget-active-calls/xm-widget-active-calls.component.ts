import {Component, Injector, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AriChannelService} from '../../../entities/ari-channel/ari-channel.service';
import {Subscription} from 'rxjs/Subscription';
import {JhiLanguageService} from 'ng-jhipster';

@Component({
    selector: 'xm-widget-active-calls',
    templateUrl: './xm-widget-active-calls.component.html'
})
export class XmWidgetActiveCallsComponent implements OnInit, OnDestroy {

    channels: any[];
    name: any;
    config: any;
    private intervalSubscription: Subscription;

    constructor(private injector: Injector,
                private ariChannelService: AriChannelService,
                private jhiLanguageService: JhiLanguageService) {
        jhiLanguageService.addLocation('widget-active-calls');
        this.config = this.injector.get('config') || {};
        this.name = this.config.name;
    }

    ngOnInit() {
        this.intervalSubscription = Observable.interval(2000).subscribe(x => {
            this.ariChannelService.query().subscribe(
                result => {
                    this.channels = result.json();
                    this.channels = this.channels.filter(c => c.caller.number && c.connected.number);
                }
            );
        });
    }

    ngOnDestroy() {
        this.intervalSubscription.unsubscribe();
    }
}
