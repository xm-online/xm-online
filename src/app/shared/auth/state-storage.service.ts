import { Injectable } from '@angular/core';
import { SessionStorageService } from 'ngx-webstorage';

const PREV_STATE = 'previousState';
const DEST_STATE = 'previousState';

@Injectable()
export class StateStorageService {


    constructor(
        private $sessionStorage: SessionStorageService
    ) {}

    getPreviousState() {
        return this.$sessionStorage.retrieve(PREV_STATE);
    }

    resetPreviousState() {
        this.$sessionStorage.clear(PREV_STATE);
    }

    resetDestinationState() {
      this.$sessionStorage.clear(DEST_STATE);
    }

    resetAllStates() {
      this.resetPreviousState();
      this.resetDestinationState();
    }

    storePreviousState(previousStateName, previousStateParams) {
        const previousState = { 'name': previousStateName, 'params': previousStateParams };
        this.$sessionStorage.store(PREV_STATE, previousState);
    }

    getDestinationState() {
        return this.$sessionStorage.retrieve(DEST_STATE);
    }

    storeUrl(url: string) {
        this.$sessionStorage.store('previousUrl', url);
    }

    getUrl() {
        return this.$sessionStorage.retrieve('previousUrl');
    }

    storeDestinationState(destinationState, destinationStateParams, fromState) {
        const destinationInfo = {
            'destination': {
                'name': destinationState.name,
                'data': destinationState.data,
            },
            'params': destinationStateParams,
            'from': {
                'name': fromState.name,
             }
        };
        this.$sessionStorage.store(DEST_STATE, destinationInfo);
    }
}
