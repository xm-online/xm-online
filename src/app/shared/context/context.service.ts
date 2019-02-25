import { Injectable } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';

@Injectable()
export class ContextService {

    private data = {};

    constructor(public eventManager: JhiEventManager) {
    }

    get(key: string) {
        return this.data[key];
    }

    put(key: string, value: any) {
        this.data[key] = value;
        this.eventManager.broadcast({ name: 'CONTEXT_UPDATED' });
    }

}
