import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { LinkSpec } from '../shared/link-spec.model';
import { Link } from '../shared/link.model';
import { XmEntity } from '../shared/xm-entity.model';
import { XmEntityService } from '../shared/xm-entity.service';

declare let $: any;

@Component({
    selector: 'xm-link-list-tree-section',
    templateUrl: './link-list-tree-section.component.html',
    styleUrls: ['./link-list-tree-section.component.scss']
})
export class LinkListTreeSectionComponent implements OnInit {

    @Input() links: Link[];
    @Input() linkSpec: LinkSpec;

    constructor(private xmEntityService: XmEntityService,
                private translateService: TranslateService) {
    }

    ngOnInit() {
        $('.tree li:has(ul)').addClass('parent_li').find(' > span')
            .attr('title', this.translateService.instant('xm-entity.link-list-tree-section.collapse'));
        $('.tree ul > li.parent_li > span').on('click', function (e) {
            console.log('click');
            const children = $(this).parent('li.parent_li').find(' > xm-link-list-tree-section > ul > li');
            console.log(children);
            if (children.is(':visible')) {
                children.hide('fast');
            } else {
                children.show('fast');
            }
            e.stopPropagation();
        });
    }

    filterByLinkType(items) {
        return items ? items.filter((link: Link) => link.typeKey === this.linkSpec.key) : [];
    }

    toggle(link) {
        if (!link.target.targets) {
            this.xmEntityService.find(link.target.id, {'embed': 'targets'}).subscribe((xmEntity: HttpResponse<XmEntity>) => {
                link.target = xmEntity.body;
                link.target.targets = link.target.targets ? link.target.targets : [];
            });
        }
    }

}
