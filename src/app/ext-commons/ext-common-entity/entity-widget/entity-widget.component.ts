import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ContextService, XmConfigService } from '../../../shared';
import {FullLinkSpec, LinkSpec, Spec, XmEntity, XmEntityService, XmEntitySpec} from '../../../xm-entity';
import { DEBUG_INFO_ENABLED } from '../../../xm.constants';
import {AttachmentsView, EntityDetailLayout, EntityUiConfig} from '../../../shared/spec/xm-ui-config-model';

@Component({
    selector: 'xm-entity-widget',
    templateUrl: './entity-widget.component.html',
    styleUrls: ['./entity-widget.component.scss']
})
export class EntityWidgetComponent implements OnInit, OnDestroy {

    config: any;
    grid: any;
    xmEntity: XmEntity;
    xmEntitySpec: XmEntitySpec;
    spec: Spec;
    backLinkSpecs: LinkSpec[];
    showLoader: boolean;
    entityUiConfig: EntityUiConfig;

    backLinkSpecs$ = new BehaviorSubject<FullLinkSpec[]>([]);
    linkSpecs$ = new BehaviorSubject<FullLinkSpec[]>([]);

    xmEntity$: Observable<XmEntity>;

    private modificationSubscription: Subscription;

    constructor(private xmEntityService: XmEntityService,
                private xmConfigService: XmConfigService,
                private contextService: ContextService,
                private eventManager: JhiEventManager) {
        this.registerModificationSubscription();
    }

    ngOnInit() {
        this.showLoader = true;
        if (DEBUG_INFO_ENABLED) {
            console.log(`DBG entity  e=%o`, this.xmEntity);
            console.log(`DBG spec  e=%o`, this.spec);
        }
        this.loadEntity();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.modificationSubscription);
    }

    private registerModificationSubscription() {
        this.modificationSubscription = this.eventManager.subscribe('xmEntityDetailModification', (response) => this.loadEntity());
    }

    private loadEntity() {
        const xmEntityId = this.config.xmEntityId ? this.config.xmEntityId : this.contextService.get('xmEntityId');
        if (!xmEntityId) {return}

        this.xmEntity$ = this.xmEntityService.find(xmEntityId, {'embed': 'data'})
            .pipe(
                map(responce => responce.body),
                tap((entity) => this.xmEntity = entity),
                tap((entity) => this.xmEntitySpec = this.getXmEntitySpec(entity.typeKey)),
                tap(() => DEBUG_INFO_ENABLED ? console.log(`DBG spec = %o`, this.xmEntitySpec) : () => {} ),
                tap((entity) => this.backLinkSpecs = this.getBackLinkSpecs(entity.typeKey)),
                tap((entity) => this.defineUiConfig()),
                tap(entity => this.linkSpecs$.next(
                    this.xmEntitySpec && this.xmEntitySpec.links ?
                        this.xmEntitySpec.links.map(spec => this.addInterfaceSpec(spec, this.entityUiConfig)) : []
                    )
                ),
                tap(entity => this.backLinkSpecs$.next(
                    this.backLinkSpecs.map(spec => this.addInterfaceSpec(spec, this.entityUiConfig))
                )),
                tap((entity) => this.defineLayoutGrid(entity.typeKey))
            )
    }

    defineUiConfig() {
        this.xmConfigService.getUiConfig().subscribe((config) => {
            this.entityUiConfig = <EntityUiConfig>(config && config.applications
                && config.applications.config
                && config.applications.config.entities
                && config.applications.config.entities.filter(e => e.typeKey === this.xmEntity.typeKey).shift());
        });
    }

    private defineLayoutGrid(typeKey: string) {
        let detailLayoutType: EntityDetailLayout = this.getXmEntitySpec(typeKey).dataSpec ? 'DEFAULT' : 'ALL-IN-ROW';
        if (this.entityUiConfig && this.entityUiConfig.detailLayoutType) {
            detailLayoutType = this.entityUiConfig.detailLayoutType;
        }

        this.grid = this.config.grid ?
            this.config.grid :
            this.getGridLayout(detailLayoutType, this.entityUiConfig
                && this.entityUiConfig.attachments
                && this.entityUiConfig.attachments.view);
    }

    getXmEntitySpec(typeKey: string) {
        const vTypeKey = typeKey ? typeKey : this.xmEntity.typeKey;
        return this.spec.types.filter(t => t.key === vTypeKey).shift();
    }

    private addInterfaceSpec(linkSpec: LinkSpec, entityUiConfig: EntityUiConfig): FullLinkSpec {

        const interfaceSpec = entityUiConfig && entityUiConfig.links && (entityUiConfig.links.items || [])
            .filter(iSpec => iSpec.typeKey === linkSpec.key).shift();

        return  {
            model: linkSpec,
            interface: interfaceSpec
        };
    }

    getBackLinkSpecs(typeKey: string): LinkSpec[] {
        const result: any = {};

        for (const xmEntitySpec of this.spec.types) {
            if (xmEntitySpec.links) {
                for (const linkSpec of xmEntitySpec.links) {
                    if (linkSpec.typeKey === typeKey) {
                        result[linkSpec.key] = Object.assign({}, linkSpec);
                    }
                }
            }
        }
        return (Object.keys(result).map(key => result[key]))
            .filter((l) => !!l.backName)
            .map((l) => {
                l.name = l.backName;
                return l;
            });
    }


    getGridLayout(detailLayoutType: EntityDetailLayout, attachmentsView?: AttachmentsView): any[] {

        let attachmentsComponent = 'attachment-grid';

        if (attachmentsView === 'list') {
            attachmentsComponent = 'attachment-list';
        }

        if (detailLayoutType === 'ALL-IN-ROW') {
            return [
                {class: 'row', content: [{class: 'col-sm-12 col-xl-8 offset-xl-2', component: 'entity-card'}]},
                {class: 'row', content: [{class: 'col-sm-12', component: 'entity-data-card'}]},
                {class: 'row', content: [{class: 'col-sm-12', component: 'function-list-card'}]},
                {class: 'row', content: [{class: 'col-sm-12', component: attachmentsComponent}]},
                {class: 'row', content: [{class: 'col-sm-12', component: 'location-list-card'}]},
                {class: 'row', content: [{class: 'col-sm-12', component: 'link-list'}]},
                {class: 'row', content: [{class: 'col-sm-12', component: 'comment-list'}]},
                {class: 'row', content: [{class: 'col-sm-12', component: 'calendar-card'}]},
                {class: 'row', content: [{class: 'col-sm-12', component: 'timeline'}]}
            ]
        }

        return [
            {class: 'row',
                content: [{class: 'col-md-6', component: 'entity-card'}, {class: 'col-md-6', component: 'entity-data-card'}]
            },
            {class: 'row', content: [{class: 'col-sm-12', component: 'function-list-card'}]},
            {class: 'row', content: [{class: 'col-sm-12', component: attachmentsComponent}]},
            {class: 'row', content: [{class: 'col-sm-12', component: 'location-list-card'}]},
            {class: 'row', content: [{class: 'col-sm-12', component: 'link-list'}]},
            {class: 'row', content: [{class: 'col-sm-12', component: 'comment-list'}]},
            {class: 'row', content: [{class: 'col-sm-12', component: 'calendar-card'}]},
            {class: 'row', content: [{class: 'col-sm-12', component: 'timeline'}]}
        ]
    }
}
