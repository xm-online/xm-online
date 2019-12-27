import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

const PREV_STATE = 'previousState';
const DEST_STATE = 'previousState';

@Injectable()
export class StateStorageService {

    constructor(
        private $sessionStorage: SessionStorageService,
    ) {}

    public getPreviousState(): any {
        return this.$sessionStorage.retrieve(PREV_STATE);
    }

    public resetPreviousState(): void {
        this.$sessionStorage.clear(PREV_STATE);
    }

    public resetDestinationState(): void {
        this.$sessionStorage.clear(DEST_STATE);
    }

    public resetAllStates(): void {
        this.resetPreviousState();
        this.resetDestinationState();
    }

    public storePreviousState(previousStateName: any, previousStateParams: any): void {
        const previousState = {name: previousStateName, params: previousStateParams};
        this.$sessionStorage.store(PREV_STATE, previousState);
    }

    public getDestinationState(): any {
        return this.$sessionStorage.retrieve(DEST_STATE);
    }

    public storeUrl(url: string): void {
        this.$sessionStorage.store('previousUrl', url);
    }

    public getUrl(): any {
        return this.$sessionStorage.retrieve('previousUrl');
    }

    public storeDestinationState(destinationState: any, destinationStateParams: any, fromState: any): void {
        const destinationInfo = {
            destination: {
                name: destinationState.name,
                data: destinationState.data,
            },
            params: destinationStateParams,
            from: {
                name: fromState.name,
            },
        };
        this.$sessionStorage.store(DEST_STATE, destinationInfo);
    }
}
