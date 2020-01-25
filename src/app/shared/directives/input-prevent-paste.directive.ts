import { Directive, HostListener } from '@angular/core';

@Directive({
    selector: '[xmInputPreventPaste]',
})
export class InputPreventPasteDirective {

    @HostListener('paste', ['$event'])
    public blockPaste(e: KeyboardEvent): void {
        e.preventDefault();
    }

    @HostListener('copy', ['$event'])
    public blockCopy(e: KeyboardEvent): void {
        e.preventDefault();
    }

    @HostListener('cut', ['$event'])
    public blockCut(e: KeyboardEvent): void {
        e.preventDefault();
    }
}
