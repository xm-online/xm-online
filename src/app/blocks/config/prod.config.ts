import { enableProdMode } from '@angular/core';
import { DEBUG_INFO_ENABLED } from '../../xm.constants';

export function ProdConfig() {
    // disable debug data on prod profile to improve performance
    if (!DEBUG_INFO_ENABLED) {
        enableProdMode();
    }
}
