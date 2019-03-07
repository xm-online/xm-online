import { Component, Input, OnInit } from '@angular/core';
import { CSRFService } from '../auth/csrf.service';
@Component({
    selector: 'xm-social',
    templateUrl: './social.component.html',
    styleUrls: [ './social.component.scss' ]
})
export class JhiSocialComponent implements OnInit {

    @Input() providerId: string;
    @Input() scope: string;
    @Input() icon: any;

    csrf: string;

    constructor(private csrfService: CSRFService) {
    }

    ngOnInit() {
        this.csrf = this.csrfService.getCSRF();
    }
}
