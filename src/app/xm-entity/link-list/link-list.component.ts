import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import {catchError, map} from 'rxjs/operators';

import { Link } from '../shared/link.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';
import { JhiEventManager } from 'ng-jhipster';
import { Subscription, Observable, of } from 'rxjs';
import { LinkSpec } from '../shared/link-spec.model';
import {Principal} from '../../shared';

@Component({
    selector: 'xm-link-list',
    templateUrl: './link-list.component.html',
    styleUrls: ['./link-list.component.scss']
})
export class LinkListComponent implements OnInit, OnDestroy, OnChanges {

    private modificationSubscription: Subscription;

    @Input() xmEntityId: number;
    @Input() linkSpecs: LinkSpec[];
    @Input() backLinkSpecs: LinkSpec[];

    xmEntity: XmEntity;
    links: Link[];

    constructor(private xmEntityService: XmEntityService,
                private eventManager: JhiEventManager,
                private principal: Principal) {
        this.registerModificationSubscription();
    }

    private registerModificationSubscription() {
        this.modificationSubscription = this.eventManager.subscribe('linkListModification', (response) => this.load());
    }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.modificationSubscription);
    }

    private load() {
        this.links = [];

        this.xmEntityService.find(this.xmEntityId, {'embed': 'targets'}).subscribe((xmEntity: HttpResponse<XmEntity>) => {
            this.xmEntity = xmEntity.body;
            if (xmEntity.body.targets) {
                this.links.push(...xmEntity.body.targets);
            }
        });

        // IEVGEN. DO NOT REMOVE. This code here is because user could get targets but could not get sources or vise versa
        this.principal.hasPrivileges(['LINK.SOURCE.GET_LIST']).then(data => {
            if (data) {
                for (const linkSpec of this.backLinkSpecs) {
                    this.getSources(linkSpec).subscribe(items => this.links.push(...items));
                }
            }
        });

    }

    /**
     * Get inverted sources
     */
    private getSources(linkSpec: LinkSpec): Observable<Link[]> {
        return this.xmEntityService.findLinkSourcesInverted('' + this.xmEntityId, [linkSpec.key], {sort: ['id,desc']})
            .pipe(
                map(response => response.body),
                map(items => items.map(item => this.inverseLink(item))),
                catchError(err => of([]))
            )
    }

    /**
     * Change source and target for item
     * @param item - inverted link
     */
    private inverseLink(item: Link): Link {
        const copy = Object.assign({}, item);
        copy.target = Object.assign({}, item.source);
        copy.source = null;
        return copy;
    }

    getModes(linkSpec: LinkSpec) {
        const isTreeMode = linkSpec.typeKey === this.xmEntity.typeKey
            || this.xmEntity.typeKey.startsWith(linkSpec.typeKey + '.');
        return isTreeMode ? ['list', 'tree'] : ['list'];
    }

    filterLinks(linkSpec: LinkSpec) {
        return this.links ? this.links.filter(link => link.typeKey === linkSpec.key) : [];
    }

    filterBackLinkSpecs() {
        return this.backLinkSpecs ? this.backLinkSpecs.filter(backLinkSpec => this.filterLinks(backLinkSpec).length > 0) : [];
    }

}
