import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[xmInputPattern]',
})
export class InputPatternDirective {
    @Input() private regexp: string;

    private regex: RegExp;
    private specialKeys: string[] = [ 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Space' ];

    constructor(private el: ElementRef) {}

    @HostListener('keydown', [ '$event' ])
    protected onKeyDown(event: KeyboardEvent): any {
        this.regex = new RegExp(this.regexp);
        if (this.specialKeys.includes(event.key) || event.ctrlKey === true) {
            return;
        }
        const current: string = this.el.nativeElement.value;
        const next: string = current.concat(event.key);

        if (next && !this.regex.test(next)) {
            event.preventDefault();
        }
    }
}
