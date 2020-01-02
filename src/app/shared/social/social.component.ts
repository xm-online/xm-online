import { Component, Input, OnInit } from '@angular/core';
import { CSRFService } from '../auth/csrf.service';

@Component({
    selector: 'xm-social',
    templateUrl: './social.component.html',
    styleUrls: ['./social.component.scss'],
})
export class JhiSocialComponent implements OnInit {

    @Input() public providerId: string;
    @Input() public scope: string;
    @Input() public icon: any;

    public csrf: string;

    constructor(private csrfService: CSRFService) {
    }

    public ngOnInit(): void {
        this.csrf = this.csrfService.getCSRF();
    }
}
