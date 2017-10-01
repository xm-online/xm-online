import {Component, OnInit, AfterViewInit} from "@angular/core";
import {Response} from "@angular/http";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {EventManager, AlertService, JhiLanguageService} from "ng-jhipster";
import {XmEntity} from "../../entities/xm-entity";
import {Link} from "../../entities/link/link.model";
import {LinkService} from "../../entities/link/link.service";
import {LinkSpec, XmEntitySpecService} from "../../shared/spec/spec.service";
import {XmEntityService} from "../../entities/xm-entity/xm-entity.service";

declare var $:any;

@Component({
    selector: 'xm-location-dialog',
    templateUrl: './search-entity-link-dialog.component.html',
})
export class SearchEntityLinkDialogComponent implements OnInit, AfterViewInit {

    authorities: any[];
    private isSaving: boolean;

    xmEntity: XmEntity;
    private typeKey: string;

    private link: Link;
    linkType: LinkSpec;

    private searchQuery: string;

    private total: number;
    private xmEntities: XmEntity[];
    private size = 5;

    constructor(
        public activeModal: NgbActiveModal,
        private alertService: AlertService,
        private eventManager: EventManager,
        private linkService: LinkService,
        private xmEntityService: XmEntityService,
        private xmEntitySpecService: XmEntitySpecService,
        private jhiLanguageService: JhiLanguageService,
    ) {
        this.link = new Link();
        this.link.source = new XmEntity();
        this.link.target = new XmEntity();
        this.jhiLanguageService.addLocation('link');
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];

        this.link.source.id = this.xmEntity.id;
        this.link.source.typeKey = this.xmEntity.typeKey;
        this.link.source.key = this.xmEntity.key;
        this.link.typeKey = this.linkType.key;

        if (!this.link.startDate) {
            this.link.startDate = new Date().toISOString();
        }

        //this.xmEntityService.search();
        this.search();
    }

    ngAfterViewInit() {
        //  Init Bootstrap Select Picker
        setTimeout(function() {
            if ($('.selectpicker').length !== 0) {
                $('.selectpicker').selectpicker();
            }
        }, 10);

    }


    clear() {
        this.activeModal.dismiss('cancel');
    }

    search() {
        this.size = 5;
        this.xmEntities = [];

        this.load();
    }

    showMore() {
        this.size = this.size + 5;
        this.load();
    }

    load() {

        this.xmEntityService.searchByTypeKeyAndQuery({
            typeKey: this.linkType.typeKey,
            query: this.searchQuery,
            size: this.size
        }).subscribe((resp: Response) => {
            this.total = parseInt(resp.headers.get("x-total-count"));
            this.xmEntities = resp.json().map(el => {
                el.state = this.getState(el.typeKey, el.stateKey);
                return el;
            });
        }, (res: Response) => this.onError(res));
    }

    getState(typeKey: string, stateKey: string) {
        return this.xmEntitySpecService.getState(typeKey, stateKey);
    }

    save(targetEntity: XmEntity) {


        this.isSaving = true;

        this.link.target = new XmEntity();
        this.link.target.id = targetEntity.id;
        this.link.target.typeKey = targetEntity.typeKey;
        this.link.target.name = targetEntity.name;
        this.link.target.description = targetEntity.description;
        this.link.target.key = targetEntity.key;

        if (this.link.id !== undefined) {
            this.linkService.update(this.link)
                .subscribe((res: XmEntity) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        } else {
            this.linkService.create(this.link)
                .subscribe((res: XmEntity) =>
                    this.onSaveSuccess(res), (res: Response) => this.onSaveError(res));
        }

    }

    private onSaveSuccess(result: any) {
        this.eventManager.broadcast({ name: 'linkListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError(error) {
        this.isSaving = false;
        try {
            error.json();
        } catch (exception) {
            error.message = error.text();
        }
        this.onError(error);
    }

    private onError(error) {
        this.alertService.error(error.message, null, null);
    }


}
