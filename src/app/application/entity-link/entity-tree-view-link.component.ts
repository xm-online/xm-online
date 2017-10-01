import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { XmEntityService } from '../../entities/xm-entity/xm-entity.service';
import { Link } from '../../entities/link/link.model';

declare let $: any;

@Component({
    selector: 'xm-entity-tree-view-link',
    templateUrl: './entity-tree-view-link.component.html',
})
export class EntityTreeViewLinkComponent implements OnInit {

    @Input() links: Link[];

    @Input() linkType: string;

    constructor(
        private xmEntityService: XmEntityService
    ) {
    }

    ngOnInit() {
        $('.tree li:has(ul)').addClass('parent_li').find(' > span').attr('title', 'Collapse this branch');
        $('.tree ul > li.parent_li > span').on('click', function (e) {
            const children = $(this).parent('li.parent_li').find(' > xm-entity-tree-view-link > ul > li');
            if (children.is(':visible')) {
                children.hide('fast');
            } else {
                children.show('fast');
            }
            e.stopPropagation();
        });
    }

    filterByEntityType(items) {
        if (!items) {
            return [];
        }

        return items.filter((link: Link) => link.typeKey == this.linkType);
    }

    toggle(id, link) {
        if (!link.target.targets) {
            this.xmEntityService.find(id).subscribe((xmEntity) => {
                link.target = xmEntity;
                link.target.targets = link.target.targets ? link.target.targets : [];
            });
        }
    }

}
