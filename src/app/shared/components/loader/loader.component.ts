import {Component, ElementRef, Input, OnInit} from '@angular/core';

@Component({
    selector: 'xm-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css']
})
export class LoaderComponent implements OnInit {

    @Input() set showLoader (value: boolean) {
        this.show = value;
        this.noDisableParent || this.elementRef.nativeElement.parentElement.classList[value ? 'add' : 'remove']('xm-disabled');
    };
    @Input() className?: string;
    @Input() noDisableParent?: boolean;
    @Input() absolute?: boolean;

    show: boolean;

    constructor(
        private elementRef: ElementRef,
    ) {
    }

    ngOnInit() {
        if (this.className) {
            this.elementRef.nativeElement.className += ` ${this.className.trim()}`;
        }
    }
}
