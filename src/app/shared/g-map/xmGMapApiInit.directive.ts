import {
    Directive,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewContainerRef,
} from '@angular/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

import { XmConfigService } from '../spec/config.service';

declare global {
    interface Window {google: { maps: any }}
}

@Directive({
    selector: '[xmGMapApiInit]',
})

export class XmGMapApiInitDirective implements OnInit, OnDestroy {
    @Output() public gMapApiReady: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() public libraries: string[] = ['geometry'];
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
    private statusLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainerRef: ViewContainerRef,
        private xmConfigService: XmConfigService,
    ) {
    }

    public ngOnInit(): void {
        if (window.google && window.google.maps) {
            this.statusLoaded.next(true);
        } else {
            this.xmConfigService
                .getConfigJson('/webapp/settings-public.yml?toJson')
                .pipe(
                    map((res) => res.googleApiKey ? res.googleApiKey : ''),
                    tap((apiKey) => this.loadGoogleMapApi(apiKey)),
                    takeUntil(this.destroyed$),
                ).subscribe();
        }

        this.statusLoaded.pipe(
            tap((status) => this.updateView(status)),
            takeUntil(this.destroyed$),
        ).subscribe();
    }

    public ngOnDestroy(): void {
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

    private loadGoogleMapApi(apiKey: string): void {
        const scriptNode = document.createElement('script');
        const apiLibraries = this.libraries.length ? `&libraries=${this.libraries.join(',')}` : '';

        scriptNode.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${apiLibraries}`;
        scriptNode.onload = (): void => this.statusLoaded.next(true);

        document.getElementsByTagName('head')[0].appendChild(scriptNode);
    }
}
