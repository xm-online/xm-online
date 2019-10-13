import { ITEMS_PER_PAGE } from '../../shared';
import { Injectable } from '@angular/core';
import { NgbPaginationConfig} from '@ng-bootstrap/ng-bootstrap';

@Injectable()
export class PaginationConfig {
    constructor(private config: NgbPaginationConfig) {
        this.config.boundaryLinks = true;
        this.config.maxSize = 5;
        this.config.pageSize = ITEMS_PER_PAGE;
        this.config.size = 'sm';
    }
}
