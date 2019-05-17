import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { JhiLanguageService } from 'ng-jhipster';

import { Activate } from './activate.service';

@Component({
    selector: 'xm-activate',
    templateUrl: './activate.component.html'
})
export class ActivateComponent implements OnInit {
    error: string;
    success: string;
    modalRef: NgbModalRef;

    constructor(private activate: Activate,
                private route: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            this.activate.get(params['key']).subscribe(() => {
                this.error = null;
                this.success = 'OK';
            }, () => {
                this.success = null;
                this.error = 'ERROR';
            });
        });
    }

    login() {
        this.router.navigate([''])
    }

    register() {
        this.router.navigate([''], { queryParams: { type: 'registration' } })
    }

}
