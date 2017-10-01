import { Injectable } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {AttachmentService} from "../../../entities/attachment/attachment.service";

@Injectable()
export class XmWidgetLotsService {

    constructor(
        private attachmentService: AttachmentService,
    ) { }

    getAttachmentImg(id): Observable<any> {
        return this.attachmentService.find(id)
            .map((result) => {
                if (result.content && result.content.value) {
                    return {
                        id: result.content.id,
                        value: `data:${result.valueContentType};base64,` + result.content.value
                    };
                }
            });
    }

    getMaxBidPrice(list: any[]): number {
        let maxPrice = 0;
        if (list && list.length) {
            list.forEach(el => {
                if (el.target && el.target.typeKey == 'BID' && el.target.data && el.target.data.bidValue) {
                    if (Number(el.target.data.bidValue) && maxPrice < el.target.data.bidValue) {
                        maxPrice = Number(el.target.data.bidValue);
                    }
                }
            });
        }
        return maxPrice;
    }

}
