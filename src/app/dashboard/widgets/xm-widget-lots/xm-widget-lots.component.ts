import {Component, Injector, OnInit} from '@angular/core';
import {EventManager, JhiLanguageService} from "ng-jhipster";
import {XmEntityService} from "../../../entities/xm-entity/xm-entity.service";
import {XmEntity} from "../../../entities/xm-entity/xm-entity.model";
import {LocalStorageService} from "ng2-webstorage";
import {Subscription} from "rxjs/Subscription";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {XmWidgetLotsDetailComponent} from "./xm-widget-lots-detail.component";
import {XmWidgetLotsService} from "./xm-widget-lots.service";

declare let moment: any;

@Component({
    selector: 'xm-widget-lots',
    templateUrl: './xm-widget-lots.component.html',
    styleUrls: ['./xm-widget-lots.component.css']
})
export class XmWidgetLotsComponent implements OnInit {

    name: string;
    lots: XmEntity[];
    noLots: boolean;
    searchQuery: string;
    private allLots: XmEntity[] = [];
    private config: any;
    private page: number = 0;
    private size: number = 6;
    private isAllEntities: boolean;
    private hiddenLots: any[];
    private lotsLimit: number = 3;
    private countdownSubscription: Subscription;

    constructor(
        private injector: Injector,
        private jhiLanguageService: JhiLanguageService,
        private xmEntityService: XmEntityService,
        private localStorage: LocalStorageService,
        private modalService: NgbModal,
        private eventManager: EventManager,
        private xmWidgetLotsService: XmWidgetLotsService,
    ) {
        this.jhiLanguageService.addLocation('widget-lots');
        this.config = this.injector.get('config') || {};
        this.name = this.config.name;
        this.config.lotsCount && (this.lotsLimit = this.config.lotsCount);
        this.registerStopCountdown();
    }

    ngOnInit() {
        this.hiddenLots = this.localStorage.retrieve('wdt-hiddenLots') || [];
        this.loadEntities()
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.countdownSubscription);
    }

    private registerStopCountdown() {
        this.countdownSubscription = this.eventManager.subscribe('lotStopCountdown', (result) => {
            if (result && result.content && result.content.id) {
                let findEl = this.lots.find(el => el.id == result.content.id);
                findEl && this.onRemove(findEl);
            }
        });
    }

    onRemove (item: XmEntity) {
        this.hiddenLots.push({id: item.id});
        this.localStorage.store('wdt-hiddenLots', this.hiddenLots);
        this.prepareLotsToView();
    }

    onView (item: XmEntity) {
        this.modalService.open(XmWidgetLotsDetailComponent, {size: 'lg'}).componentInstance.xmEntity = item;
    }

    onSearch() {
        this.page = 0;
        this.allLots = [];
        this.loadEntities(this.searchQuery);
    }

    private loadEntities (query?: string) {
        this.xmEntityService.search({
            typeKey: this.config.lotsTypeKey || 'LOT.CAR',
            query: (this.config.lotsSearchPrefix || 'typeKey:LOT.CAR* AND stateKey:BIDDING') + (query ? (' AND ' + query) : ''),
            size: this.size,
            page: this.page++,
            sort: ['id,asc']
        }).subscribe(
            (resp) => {
                this.allLots = [...this.allLots, ...resp.json()];
                this.isAllEntities = this.allLots.length == parseInt(resp.headers.get('X-Total-Count'));
                this.prepareLotsToView();
            },
            (resp: Response) => {
                this.noLots = true;
            }
        );
    }

    private loadEntitiesDetail(list): XmEntity[] {
        return list.map(el => {
            el.countdownFrom = el.data.lotDuration.endDate;
            // el.countdownFrom = moment().add('seconds', 10).toJSON();

            el.isDetail || this.xmEntityService.find(el.id)
                .subscribe(result => {
                    el.isDetail = true;
                    el.attachments = result.attachments;
                    el.targets = result.targets;
                    
                    if (el.attachments && el.attachments.length) {
                        this.xmWidgetLotsService.getAttachmentImg(el.attachments[0].id).subscribe(result => {
                            el.attachments[0].content = result;
                            el.img = result.value;
                        });
                    }

                    el.maxPrice = this.xmWidgetLotsService.getMaxBidPrice(el.targets) || (el.data && el.data.lotStartBid) || 0;
                });
            return el;
        });
    }

    private getViewedLots(list: any[]=[]) {
        return list.filter(el => {
           return el.data && el.data.lotDuration && el.data.lotDuration.endDate
               && el.data.lotDuration.endDate > moment().toJSON() && !this.hiddenLots.find(item => item.id == el.id);
        });
    }

    private prepareLotsToView() {
        this.ngOnDestroy();
        let viewedLots = this.getViewedLots(this.allLots);
        if (viewedLots.length >= this.lotsLimit) {
            viewedLots.length = this.lotsLimit;
        } else if (!this.isAllEntities) {
            this.loadEntities();
            return;
        }
        this.lots = this.loadEntitiesDetail(viewedLots);
        this.noLots = !this.lots.length;
    }

}
