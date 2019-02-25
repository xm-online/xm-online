import {AfterViewInit, Directive, ElementRef, Renderer2} from '@angular/core';

@Directive({ selector: '[xmFocus]' })
export class FocusDirective implements AfterViewInit {

    constructor(private hostElement: ElementRef, private renderer: Renderer2) {}

    ngAfterViewInit() {
        window.setTimeout(() => {
            this.hostElement.nativeElement.focus();
            this.renderer.parentNode(this.hostElement.nativeElement).focus();
        });
    }
}
