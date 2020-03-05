import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { XmEventManager } from '@xm-ngx/core';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Principal } from '../../shared';
import { FullLinkSpec, LinkSpec } from '../shared/link-spec.model';
import { Link } from '../shared/link.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';

@Component({
    selector: 'xm-link-list',
    templateUrl: './link-list.component.html',
    styleUrls: ['./link-list.component.scss'],
})
export class LinkListComponent implements OnDestroy, OnChanges {

    @Input() public xmEntityId: number;
    @Input() public linkSpecs: FullLinkSpec[];
    @Input() public backLinkSpecs: FullLinkSpec[];
    public xmEntity: XmEntity;
    public links: Link[];
    private modificationSubscription: Subscription;

    constructor(private xmEntityService: XmEntityService,
                private eventManager: XmEventManager,
                private principal: Principal) {
        this.registerModificationSubscription();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.xmEntityId && changes.xmEntityId.previousValue !== changes.xmEntityId.currentValue) {
            this.load();
        }
    }

    public ngOnDestroy(): void {
        this.eventManager.destroy(this.modificationSubscription);
    }

    public getModes(linkSpec: LinkSpec): string[] {
        const isTreeMode = linkSpec.typeKey === this.xmEntity.typeKey
            || this.xmEntity.typeKey.startsWith(linkSpec.typeKey + '.');
        return isTreeMode ? ['list', 'tree'] : ['list'];
    }

    public filterLinks(linkSpec: LinkSpec): Link[] {
        return this.links ? this.links.filter((link) => link.typeKey === linkSpec.key) : [];
    }

    public filterBackLinkSpecs(): FullLinkSpec[] {
        return this.backLinkSpecs
            ? this.backLinkSpecs.filter((backLinkSpec) => this.filterLinks(backLinkSpec.model).length > 0)
            : [];
    }

    private registerModificationSubscription(): void {
        this.modificationSubscription = this.eventManager.subscribe('linkListModification', () => this.load());
    }

    private load(): void {
        this.links = [];

        this.xmEntityService.find(this.xmEntityId, {embed: 'targets'})
            .subscribe((xmEntity: HttpResponse<XmEntity>) => {
                this.xmEntity = xmEntity.body;
                if (xmEntity.body.targets) {
                    this.links.push(...xmEntity.body.targets);
                }
            });

        // IEVGEN. DO NOT REMOVE.
        // This code here is because user could get targets but could not get sources or vise versa
        this.principal.hasPrivileges(['LINK.SOURCE.GET_LIST']).then((data) => {
            if (data) {
                this.getSources().subscribe((items) => this.links.push(...items));
            }
        });

    }

    /**
     * Get inverted sources
     */
    private getSources(): Observable<Link[]> {
        const keys = this.backLinkSpecs.map((spec) => spec.model.key);

        return this.xmEntityService.findLinkSourcesInverted('' + this.xmEntityId, keys, {sort: ['id,desc']})
            .pipe(
                map((response) => response.body),
                map((items) => items.map((item) => this.inverseLink(item))),
                catchError(() => of([])),
            );
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

}
