import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription } from 'rxjs';

import { I18nNamePipe, JhiLanguageHelper, Principal } from '../shared';
import { Spec, XmEntity, XmEntityService, XmEntitySpecWrapperService } from '../xm-entity';

declare const $: any;

@Component({
    selector: 'xm-entity-detail',
    templateUrl: './entity-detail.component.html',
})
export class EntityDetailComponent implements OnInit, OnDestroy {

    public xmEntity: XmEntity;
    public spec: Spec;
    private routeData: any;
    private eventSubscriber: Subscription;
    private routeParamsSubscription: any;
    private routeDataSubscription: Subscription;

    constructor(private eventManager: JhiEventManager,
                private jhiLanguageHelper: JhiLanguageHelper,
                private xmEntityService: XmEntityService,
                private xmEntitySpecWrapperService: XmEntitySpecWrapperService,
                private route: ActivatedRoute,
                private i18nNamePipe: I18nNamePipe,
                private principal: Principal) {
    }

    public ngOnInit(): void {
        this.xmEntitySpecWrapperService.spec().then((spec) => this.spec = spec);
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.routeData = data;
        });
        this.routeParamsSubscription = this.route.params.subscribe((params) => {
            if (params.key) {
                this.xmEntitySpecWrapperService.spec().then((spec) => {
                    const type = spec.types.filter((t) => t.key === params.key).shift() || {};
                    if (type && type.name) {
                        this.routeData.pageSubTitle = this.i18nNamePipe.transform(type.name, this.principal);
                    }
                });
            }
            this.load(params.id);
        });
        this.registerChangeInXmEntities();
    }

    public ngOnDestroy(): void {
        $.xmEntity = null;
        this.routeParamsSubscription.unsubscribe();
        this.routeDataSubscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    private registerChangeInXmEntities(): void {
        this.eventSubscriber = this.eventManager.subscribe('xmEntityDetailModification',
            () => this.load(this.xmEntity.id));
    }

    private load(id: any): void {
        $.xmEntity = null;
        this.xmEntity = null;
        this.xmEntityService.find(id, {embed: 'data'}).subscribe((xmEntity) => {
                this.xmEntity = xmEntity.body;
                $.xmEntity = xmEntity.body;
                this.routeData.pageSubSubTitle = this.xmEntity.name;
                this.jhiLanguageHelper.updateTitle();
            },
            (err) => console.info(err));
    }

}
