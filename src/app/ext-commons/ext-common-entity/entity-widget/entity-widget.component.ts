import { Component, OnDestroy, OnInit } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';
import {Observable, Subscription} from 'rxjs';
import {finalize, map, tap} from 'rxjs/operators';

import { ContextService, XmConfigService } from '../../../shared';
import {LinkSpec, Spec, XmEntity, XmEntityService, XmEntitySpec} from '../../../xm-entity';

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
                tap(() => this.xmEntitySpec = this.getXmEntitySpec()),
                tap(() => this.backLinkSpecs = this.getBackLinkSpecs()),
                tap(() => this.defineLayoutGrid())
            )
    }

    private defineLayoutGrid() {
        this.xmConfigService.getUiConfig().subscribe((config) => {
            const entityUiConfig = config && config.applications
                && config.applications.config
                && config.applications.config.entities
                && config.applications.config.entities.filter(e => e.typeKey === this.xmEntity.typeKey).shift();
            let detailLayoutType = this.getXmEntitySpec().dataSpec ? 'DEFAULT' : 'ALL-IN-ROW';
            if (entityUiConfig && entityUiConfig.detailLayoutType) {
                detailLayoutType = entityUiConfig.detailLayoutType;
            }

            this.grid = this.config.grid ?
                this.config.grid :
                this.getGridLayout(entityUiConfig && entityUiConfig.attachments && entityUiConfig.attachments.view, detailLayoutType);
        });
    }

    getXmEntitySpec() {
        return this.spec.types.filter(t => t.key === this.xmEntity.typeKey).shift();
    }

    getBackLinkSpecs(): LinkSpec[] {
        const result = {};
        for (const xmEntitySpec of this.spec.types) {
            if (xmEntitySpec.links) {
                for (const linkSpec of xmEntitySpec.links) {
                    if (linkSpec.typeKey === this.xmEntity.typeKey) {
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

    // TODO: improve types
    getGridLayout(attachmentsView: 'list'|undefined, detailLayoutType: string): any[] {

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
                content: [{class: 'col-sm-6', component: 'entity-card'}, {class: 'col-sm-6', component: 'entity-data-card'}]
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
