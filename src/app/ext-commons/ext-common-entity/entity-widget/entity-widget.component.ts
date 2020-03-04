import { Component, OnDestroy, OnInit } from '@angular/core';
import { XmEventManager } from '@xm-ngx/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { ContextService, XmConfigService } from '../../../shared';
import { AttachmentsView, EntityDetailLayout, EntityUiConfig } from '../../../shared/spec/xm-ui-config-model';
import { FullLinkSpec, LinkSpec, Spec, XmEntity, XmEntityService, XmEntitySpec } from '../../../xm-entity';
import { DEBUG_INFO_ENABLED } from '../../../xm.constants';

@Component({
    selector: 'xm-entity-widget',
    templateUrl: './entity-widget.component.html',
    styleUrls: ['./entity-widget.component.scss'],
})
export class EntityWidgetComponent implements OnInit, OnDestroy {

    public config: any;
    public grid: any;
    public xmEntity: XmEntity;
    public xmEntitySpec: XmEntitySpec;
    public spec: Spec;
    public backLinkSpecs: LinkSpec[];
    public showLoader: boolean;
    public entityUiConfig: EntityUiConfig;
    // TODO for demo
    public tenant: string;
    public defaultDetailLayoutType: EntityDetailLayout;

    public backLinkSpecs$: BehaviorSubject<FullLinkSpec[]> = new BehaviorSubject<FullLinkSpec[]>([]);
    public linkSpecs$: BehaviorSubject<FullLinkSpec[]> = new BehaviorSubject<FullLinkSpec[]>([]);

    public xmEntity$: Observable<XmEntity>;

    private modificationSubscription: Subscription;

    constructor(private xmEntityService: XmEntityService,
                private xmConfigService: XmConfigService,
                private contextService: ContextService,
                private eventManager: XmEventManager) {
        this.registerModificationSubscription();
    }

    public ngOnInit(): void {
        this.showLoader = true;
        if (DEBUG_INFO_ENABLED) {
            console.info(`DBG entity  e=%o`, this.xmEntity);
            console.info(`DBG spec  e=%o`, this.spec);
        }
        this.loadEntity();
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.modificationSubscription);
    }

    public defineUiConfig(): void {
        this.xmConfigService.getUiConfig().subscribe((config) => {
            // TODO for demo
            this.tenant = config.name;
            this.defaultDetailLayoutType = config.defaultDetailLayoutType;
            this.entityUiConfig = (config && config.applications
                && config.applications.config
                && config.applications.config.entities
                && config.applications.config.entities
                    .filter((e) => e.typeKey === this.xmEntity.typeKey).shift()) as EntityUiConfig;
        });
    }

    public getXmEntitySpec(typeKey: string): XmEntitySpec {
        const vTypeKey = typeKey ? typeKey : this.xmEntity.typeKey;
        return this.spec.types.filter((t) => t.key === vTypeKey).shift();
    }

    public getBackLinkSpecs(typeKey: string): LinkSpec[] {
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
        return (Object.keys(result).map((key) => result[key]))
            .filter((l) => !!l.backName)
            .map((l) => {
                l.name = l.backName;
                return l;
            });
    }

    public getGridLayout(detailLayoutType: EntityDetailLayout, attachmentsView?: AttachmentsView): any[] {

        let attachmentsComponent = 'attachment-grid';

        if (attachmentsView === 'list') {
            attachmentsComponent = 'attachment-list';
        }

        // TODO for demo
        if (['XM Product Catalog', 'Cimdemo'].includes(this.tenant)) {
            detailLayoutType = 'COMPACT';
        }

        const grid = [
            {class: 'row', content: [{class: 'col-sm-12', component: 'function-list-card'}]},
            {class: 'row', content: [{class: 'col-sm-12', component: attachmentsComponent}]},
            {class: 'row', content: [{class: 'col-sm-12', component: 'location-list-card'}]},
            {class: 'row', content: [{class: 'col-sm-12', component: 'link-list'}]},
            {class: 'row', content: [{class: 'col-sm-12', component: 'comment-list'}]},
            {class: 'row', content: [{class: 'col-sm-12', component: 'calendar-card'}]},
            {class: 'row', content: [{class: 'col-sm-12', component: 'timeline'}]},
        ];

        if (detailLayoutType === 'ALL-IN-ROW') {
            grid.unshift({class: 'row', content: [{class: 'col-sm-12', component: 'entity-data-card'}]});
            grid.unshift({
                class: 'row',
                content: [{class: 'col-sm-12 col-xl-8 offset-xl-2', component: 'entity-card'}],
            });
            return grid;
        } else if (detailLayoutType === 'COMPACT') {
            grid.unshift({class: 'row', content: [{class: 'col-sm-12', component: 'entity-card-compact'}]});
            return grid;
        }

        grid.unshift({
            class: 'row',
            content: [{class: 'col-md-6', component: 'entity-card'}, {
                class: 'col-md-6',
                component: 'entity-data-card',
            }],
        });

        return grid;
    }

    private registerModificationSubscription(): void {
        this.modificationSubscription = this.eventManager
            .subscribe('xmEntityDetailModification', () => this.loadEntity());
    }

    private loadEntity(): void {
        const xmEntityId = this.config.xmEntityId ? this.config.xmEntityId : this.contextService.get('xmEntityId');
        if (!xmEntityId) {
            return;
        }

        this.xmEntity$ = this.xmEntityService.find(xmEntityId, {embed: 'data'})
            .pipe(
                map((responce) => responce.body),
                tap((entity) => this.xmEntity = entity),
                tap((entity) => this.xmEntitySpec = this.getXmEntitySpec(entity.typeKey)),
                tap(() => DEBUG_INFO_ENABLED ? console.info(`DBG spec = %o`, this.xmEntitySpec) : undefined),
                tap((entity) => this.backLinkSpecs = this.getBackLinkSpecs(entity.typeKey)),
                tap(() => this.defineUiConfig()),
                tap(() => this.linkSpecs$.next(
                    this.xmEntitySpec && this.xmEntitySpec.links ?
                        this.xmEntitySpec.links.map((spec) => this.addInterfaceSpec(spec, this.entityUiConfig)) : [],
                    ),
                ),
                tap(() => this.backLinkSpecs$.next(
                    this.backLinkSpecs.map((spec) => this.addInterfaceSpec(spec, this.entityUiConfig)),
                )),
                tap((entity) => this.defineLayoutGrid(entity.typeKey)),
            );
    }

    private defineLayoutGrid(typeKey: string): void {
        let detailLayoutType: EntityDetailLayout = this.getXmEntitySpec(typeKey).dataSpec ? 'DEFAULT' : 'ALL-IN-ROW';
        if (this.defaultDetailLayoutType) {
            detailLayoutType = this.defaultDetailLayoutType;
        }

        this.grid = this.config.grid ?
            this.config.grid :
            this.getGridLayout(detailLayoutType, this.entityUiConfig
                && this.entityUiConfig.attachments
                && this.entityUiConfig.attachments.view);
    }

    private addInterfaceSpec(linkSpec: LinkSpec, entityUiConfig: EntityUiConfig): FullLinkSpec {

        const interfaceSpec = entityUiConfig && entityUiConfig.links && (entityUiConfig.links.items || [])
            .filter((iSpec) => iSpec.typeKey === linkSpec.key).shift();

        return {
            model: linkSpec,
            interface: interfaceSpec,
        };
    }
}
