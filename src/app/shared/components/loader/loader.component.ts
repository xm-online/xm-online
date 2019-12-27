import { Component, ElementRef, Input, OnInit } from '@angular/core';

@Component({
    selector: 'xm-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.css'],
})
export class LoaderComponent implements OnInit {

    @Input() public className?: string;
    @Input() public noDisableParent?: boolean;
    @Input() public absolute?: boolean;
    public show: boolean;

    constructor(
        private elementRef: ElementRef,
    ) {
    }

    @Input() set showLoader(value: boolean) {
        this.show = value;
        if (!this.noDisableParent) {
            this.elementRef.nativeElement
                .parentElement.classList[value ? 'add' : 'remove']('xm-disabled');
        }
    }

    public ngOnInit(): void {
        if (this.className) {
            this.elementRef.nativeElement.className += ` ${this.className.trim()}`;
        }
    }
}
