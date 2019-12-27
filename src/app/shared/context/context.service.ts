import { Injectable } from '@angular/core';
import { JhiEventManager } from 'ng-jhipster';

@Injectable()
export class ContextService {

    private data: any = {};

    constructor(public eventManager: JhiEventManager) {
    }

    public get(key: string): any {
        return this.data[key];
    }

    public put(key: string, value: any): void {
        this.data[key] = value;
        this.eventManager.broadcast({name: 'CONTEXT_UPDATED'});
    }

}
