import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'xm-social-register',
    templateUrl: './social-register.component.html',
})
export class SocialRegisterComponent implements OnInit {
    public success: boolean;
    public error: boolean;
    public provider: string;
    public providerLabel: string;
    public modalRef: NgbModalRef;

    constructor(
        private route: ActivatedRoute,
    ) {
    }

    public ngOnInit(): void {
        this.route.queryParams.subscribe((queryParams) => {
            this.success = /true/.test(queryParams.success.toLowerCase());
        });
        this.route.params.subscribe((params) => {
            this.provider = params['provider?{success:boolean}'];
        });
        this.error = !this.success;
        this.providerLabel = this.provider.charAt(0).toUpperCase() + this.provider.slice(1);
    }

    public login(): void {
    }

}
