import {Component, Input, OnInit} from '@angular/core';
import {XmEntity} from "../../entities/xm-entity/xm-entity.model";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {EventManager, JhiLanguageService} from "ng-jhipster";
import {Subscription} from "rxjs/Subscription";
import {LinkSpec, XmEntitySpecService} from "../../shared/spec/spec.service";
import {XmEntityService} from "../../entities/xm-entity/xm-entity.service";
import {Link} from "../../entities/link/link.model";
import {NewEntityLinkDialogComponent} from "./new-entity-link-dialog.component";
import {SearchEntityLinkDialogComponent} from "./search-entity-link-dialog.component";
import {EntityLinkDeleteDialogComponent} from "./entity-link-delete-dialog.component";
import {Principal} from "../../shared/auth/principal.service";

@Component({
  selector: 'xm-link-cmp',
  templateUrl: './entity-link.component.html'
})
export class EntityLinkComponent implements OnInit {

    @Input() xmEntityId: number;

    xmEntity: XmEntity;
    linkTypes: any;
    links: Link[];
    linkTypesArray: LinkSpec[];
    linkViewMode: "tree" | "list" = "list";
    private modifySubscription: Subscription;

    constructor(
        private eventManager: EventManager,
        private principal: Principal,
        private modalService: NgbModal,
        private xmEntitySpecService: XmEntitySpecService,
        private xmEntityService: XmEntityService,
        private jhiLanguageService: JhiLanguageService
    ) {
        this.registerListModify();
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
        this.load()
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.modifySubscription);
    }

    private registerListModify() {
        this.modifySubscription = this.eventManager.subscribe('linkListModification', (response) => this.load());
    }

    private load() {
        this.xmEntityService.find(this.xmEntityId)
            .subscribe(xmEntity => {
                const typeKey = xmEntity.typeKey;

                this.xmEntity = xmEntity;
                this.linkTypes = this.xmEntitySpecService.getLinkTypes(typeKey);
                this.linkTypesArray = this.typesSpecToArray(this.linkTypes);

                const link = new Link();
                link.target = this.xmEntity;
                this.links = [link];
            })
        ;
    }

    onRemove(link) {
        return this.openDialog(EntityLinkDeleteDialogComponent, modalRef => {
            modalRef.componentInstance.entityLink = link;
        });
    }

    onManage(linkType: LinkSpec, link: Link) {
        if (linkType.builderType == "NEW") {
            return this.openDialog(NewEntityLinkDialogComponent, modalRef => {
                // modalRef.componentInstance.xmEntity = this.xmEntity;
                modalRef.componentInstance.linkType = linkType;
                if (link) {
                    modalRef.componentInstance.link = link;
                }
            }, {size: 'lg'});
        } else if (linkType.builderType == "SEARCH") {
            return this.openDialog(SearchEntityLinkDialogComponent, modalRef => {
                // modalRef.componentInstance.xmEntity = this.xmEntity;
                modalRef.componentInstance.linkType = linkType;
                if (link) {
                    modalRef.componentInstance.link = link;
                }
            }, {size: 'lg'});
        }
    }

    isLinkHasTreeView(linkType: LinkSpec) {
        return linkType.typeKey == this.xmEntity.typeKey || this.xmEntity.typeKey.startsWith(linkType.typeKey + ".");
    }

    filterByType(items, typeKey) {
        return items ? items.filter(item => item.typeKey == typeKey): [];
    }
    
    private openDialog(dialogClass, operation, options?) {
        const modalRef = this.modalService.open(dialogClass, options ? options : {});
        modalRef.componentInstance.xmEntity = this.xmEntity;
        operation(modalRef);
        return modalRef;
    }

    private typesSpecToArray(types) {
        return types ? Object.keys(types).map(key => types[key]) : [];
    }

}
