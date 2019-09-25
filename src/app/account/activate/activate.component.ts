import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { JhiLanguageService } from 'ng-jhipster';

import { Activate } from './activate.service';

@Component({
    selector: 'xm-activate',
    templateUrl: './activate.component.html',
})
export class ActivateComponent implements OnInit {
    public error: string;
    public success: string;
    public modalRef: NgbModalRef;

    constructor(private activate: Activate,
                private route: ActivatedRoute,
                private router: Router) {
    }

    public ngOnInit(): void {
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

    public login(): void {
        this.router.navigate(['']);
    }

    public register(): void {
        this.router.navigate([''], { queryParams: { type: 'registration' } });
    }

}
