import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'xm-iframe-widget',
    templateUrl: './iframe-widget.component.html',
    styleUrls: ['./iframe-widget.component.scss']
})
export class IframeWidgetComponent implements OnInit {

    name: any;
    url: any;
    config: any;

    constructor(private sanitizer: DomSanitizer) {
    }

    ngOnInit() {
        this.name = this.config.name;
        if (this.config.url) {
            this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.config.url)
        }
    }

}
