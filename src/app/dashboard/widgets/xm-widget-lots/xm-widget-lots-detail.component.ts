import {Component, OnInit} from '@angular/core';
import {EventManager, JhiLanguageService} from "ng-jhipster";
import {XmEntity} from "../../../entities/xm-entity/xm-entity.model";
import {Subscription} from "rxjs/Subscription";
import {NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import {XmWidgetLotsService} from "./xm-widget-lots.service";
import { TranslateService } from 'ng2-translate/ng2-translate';
import {XmEntityService} from "../../../entities/xm-entity/xm-entity.service";
import {XmEntitySpecService} from "../../../shared/spec/spec.service";
import {Link} from "../../../entities/link/link.model";
import {LinkService} from "../../../entities/link/link.service";

declare let moment: any;
declare let swal: any;

@Component({
    selector: 'xm-widget-lots-detail',
    templateUrl: './xm-widget-lots-detail.component.html',
    styleUrls: ['./xm-widget-lots.component.css']
})
export class XmWidgetLotsDetailComponent implements OnInit{

    xmEntity: XmEntity;
    info: {caption: string, value: string}[];
    bidHistory: any[];
    images: any[];
    isTimeUp: boolean;
    private stateFinished: string = "FINISHED";
    private countdownSubscription: Subscription;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        public xmEntityService: XmEntityService,
        private xmEntitySpecService: XmEntitySpecService,
        private linkService: LinkService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager,
        private xmWidgetLotsService: XmWidgetLotsService,
        private translateService: TranslateService,
    ) {
        this.jhiLanguageService.addLocation('widget-lots');
        this.registerStopCountdown();
    }

    ngOnInit() {
        this.getEntityData();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.countdownSubscription);
    }

    private registerStopCountdown() {
        this.countdownSubscription = this.eventManager.subscribe('lotStopCountdown', (result) => {
            if (result && result.content && result.content.id == this.xmEntity.id) {
                this.xmEntity.stateKey = this.stateFinished;
                this.isTimeUp = true;
            }
        });
    }

    onCancel() {
        this.activeModal.dismiss('cancel');
    }

    onPlaceBib() {
        return this.xmEntitySpecService.generateXmEntity({'typeKey': 'BID'}).toPromise()
            .then(result => {
                return this.xmEntityService.find(result.json().id).toPromise();
            })
            .then(result => {
                let entity: any = this.xmEntity;
                result.data = {
                    bidValue: parseInt(entity.maxPrice) + 100 + ""
                };
                this.xmEntityService.update(result).toPromise();
                let link = new Link();
                link.typeKey = this.xmEntity.typeKey;
                link.startDate = new Date().toISOString();
                link.source = new XmEntity();
                link.source.id = this.xmEntity.id;
                link.source.typeKey = this.xmEntity.typeKey;
                link.source.key = this.xmEntity.key;
                link.target = result;
                this.linkService.create(link)
                    .subscribe(result => {
                        this.xmEntity.targets || (this.xmEntity.targets = []);
                        this.xmEntity.targets.push(link);
                        this.bidHistory = this.getBidHistory(this.xmEntity);
                        let xmEntity: any = this.xmEntity;
                        xmEntity.maxPrice = this.xmWidgetLotsService.getMaxBidPrice(xmEntity.targets) || (xmEntity.data && xmEntity.data.lotStartBid) || 0;
                        swal({
                            type: 'success',
                            text: this.translateService.instant('xmApp.widgetLots.placeBidAlert'),
                            buttonsStyling: false,
                            confirmButtonClass: 'btn btn-success'

                        });
                    });
            })
            ;
    }

    onBuy() {
        this.xmEntityService.changeState(this.xmEntity.id, this.stateFinished)
            .subscribe((result: XmEntity) => {
                this.xmEntity.stateKey = result.stateKey;
                swal({
                    type: 'success',
                    text: this.translateService.instant('xmApp.widgetLots.buyLotAlert'),
                    buttonsStyling: false,
                    confirmButtonClass: 'btn btn-success'

                });
            });
    }

    private getEntityData() {
        this.info = this.getGeneralInfo(this.xmEntity);
        this.bidHistory = this.getBidHistory(this.xmEntity);
        this.images = this.getAttachmentsImg(this.xmEntity);
    }

    private getAttachmentsImg(xmEntity: any) {
        if (xmEntity.attachments && xmEntity.attachments.length) {
            return xmEntity.attachments.map(el => {
                el.content && el.content.value || this.xmWidgetLotsService.getAttachmentImg(el.id).subscribe(result => el.content = result);
                return el;
            });
        } else {
            return null;
        }
    }

    private getGeneralInfo(xmEntity: any): any[] {
        return xmEntity && xmEntity.data && xmEntity.data.lotCharacteristics;
    }

    private getBidHistory(xmEntity: any): any[] {
        return xmEntity.targets ? xmEntity.targets.map(el => {
            if (el.target && el.target.typeKey == 'BID' && el.target.updateDate && el.target.data && el.target.data.bidValue) {
                return {
                    date: moment(el.target.updateDate).format('YYYY-MM-DD HH:mm:ss'),
                    price: el.target.data.bidValue
                };
            } else {
                return null;
            }
        })
            .filter(el => el)
            .sort((a, b) => b.price - a.price)
            .slice(0, 5)
            : null;
    }

}
