import {
    Directive, EventEmitter, Input, OnDestroy, OnInit, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { XmConfigService } from '../spec/config.service';

@Directive({
    selector: '[xmGMapApiInit]',
})

export class XmGMapApiInitDirective implements OnInit, OnDestroy {
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private statusLoaded = new BehaviorSubject(false);

    @Output() gMapApiReady = new EventEmitter<boolean>();
    @Input() libraries: string[] = ['geometry'];

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private xmConfigService: XmConfigService
    ) {
    }

    ngOnInit() {
        if (window.hasOwnProperty('google') && window['google'].hasOwnProperty('maps')) {
            this.statusLoaded.next(true);
        } else {
            this.xmConfigService
                .getConfigJson('/webapp/settings-public.yml?toJson')
                .pipe(
                    map((response) => response.hasOwnProperty('googleApiKey') ? response['googleApiKey'] : ''),
                    tap((apiKey) => this.loadGoogleMapApi(apiKey)),
                    takeUntil(this.destroyed$),
                ).subscribe(() => {});
        }

        this.statusLoaded.pipe(
            tap((status) => this.updateView(status)),
            takeUntil(this.destroyed$),
        ).subscribe(() => {});
    }

    ngOnDestroy() {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    private updateView(status: boolean): void {
        this.viewContainerRef.clear();

        if (status) {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
            this.statusLoaded.complete();
            this.gMapApiReady.emit(status);
        }
    }

    private loadGoogleMapApi(apiKey: string) {
        const scriptNode = document.createElement('script');
        const apiLibraries = this.libraries.length ? `&libraries=${this.libraries.join(',')}` : '';

        scriptNode.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${apiLibraries}`;
        scriptNode.onload = () => this.statusLoaded.next(true);

        document.getElementsByTagName('head')[0].appendChild(scriptNode);
    }
}
