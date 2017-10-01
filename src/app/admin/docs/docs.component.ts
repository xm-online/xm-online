import { Component } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

@Component({
    selector: 'xm-docs',
    templateUrl: './docs.component.html'
})
export class JhiDocsComponent {
    constructor(
        private jhiLanguageService: JhiLanguageService
    ) {
        this.jhiLanguageService.setLocations(['global']);
    }
}
