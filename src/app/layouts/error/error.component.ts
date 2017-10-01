import { Component, OnInit } from '@angular/core';
import { JhiLanguageService } from 'ng-jhipster';

@Component({
    selector: 'xm-error',
    templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {
    errorMessage: string;
    error403: boolean;

    constructor(
        private jhiLanguageService: JhiLanguageService
    ) {
        this.jhiLanguageService.addLocation('error');
    }

    ngOnInit() {
    }
}
