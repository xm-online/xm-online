import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'xm-iframe-widget',
    templateUrl: './iframe-widget.component.html',
    styleUrls: ['./iframe-widget.component.scss'],
})
export class IframeWidgetComponent implements OnInit {

    public name: any;
    public url: any;
    public config: any;

    constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.name = this.config.name;
        if (this.route.snapshot && this.route.snapshot.queryParams && this.route.snapshot.queryParams.contentUrl) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.route.snapshot.queryParams.contentUrl);
        } else if (this.config.url) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.config.url);
        }
    }

}
