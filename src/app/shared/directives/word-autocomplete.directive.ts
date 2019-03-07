import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

enum KEY_CODE {
    ENTER = 13,
    ESCAPE = 27,
    SPACE = 32,
    UP_ARROW = 38,
    DOWN_ARROW = 40
}

@Directive({
    selector: '[wordAutocomplete]',
    host: {
        '(keydown)': 'onKeydown($event)',
        '(keyup)': 'onKeyup($event)',
        '(blur)': 'onBlur($event)',
    }
})
export class WordAutocompleteDirective implements OnInit{

    @Input('wordAutocomplete') words: string[] = [];

    private parentEl: HTMLElement;
    private wordListEl: any;
    private replaceStr: string;
    private showPopup: boolean;
    private canvasCtx: any;
    private KEY_CODE_DIS = [13, 27, 38, 40];
    private transNoVariables: any;

    constructor(
        private elementRef: ElementRef,
        private translateService: TranslateService,
    ) {
    }

    ngOnInit() {
        this.elementRef.nativeElement.style.position = 'relative';
        this.elementRef.nativeElement.autocomplete = 'off';
        this.parentEl = this.elementRef.nativeElement.parentElement;
        this.parentEl.classList.add('word-container');

        this.parentEl.addEventListener('click', (event) => {
            const ev: any = event;
            if (ev.target.classList.contains('word-item')) {
                this.onAddWord(ev.target.textContent);
                this.onRemoveWordListContainer();
            }
        });

        let canvas = document.createElement('canvas'),
            canvasCtx = canvas.getContext('2d')
        ;
        canvasCtx.font = "14px sans-serif";
        this.canvasCtx = canvasCtx;
        setTimeout(() => this.transNoVariables = this.translateService.instant('wordAutocomplete.noVariables'), 100);
        this.onAddHint();
    }

    ngOnDestroy() {
        this.onRemoveHint();
    }

    onKeydown(ev): boolean {
        if (ev.keyCode == KEY_CODE.ENTER) {
            let word = this.wordListEl.querySelector('.word-item.active');
            word && this.onAddWord(word.textContent);
            this.onRemoveWordListContainer();
        } else if (ev.keyCode == KEY_CODE.ESCAPE) {
            this.onRemoveWordListContainer();
        } else if (ev.keyCode == KEY_CODE.UP_ARROW && this.showPopup) {
            [].reduceRight.call(this.wordListEl.childNodes, (isNextActive, el, pos) => {
                if (isNextActive) {
                    return el.classList.add('active');
                } else if (el.classList.contains('active') && pos != 0) {
                    el.classList.remove('active');
                    return true;
                }
            }, false);
        } else if (ev.keyCode == KEY_CODE.DOWN_ARROW && this.showPopup) {
            const count = this.wordListEl.childNodes.length - 1;
            [].reduce.call(this.wordListEl.childNodes, (isNextActive, el, pos) => {
                if (isNextActive) {
                    return el.classList.add('active');
                } else if (el.classList.contains('active') && pos != count) {
                    el.classList.remove('active');
                    return true;
                }
            }, false);
        } else {
            return true;
        }
        ev.preventDefault();
        ev.stopPropagation();
        ev.stopImmediatePropagation();
        return false;
    }

    onKeyup(ev) {
        if (
            !(this.KEY_CODE_DIS.find(el => el == ev.keyCode)) &&
            ((ev.ctrlKey && ev.keyCode == KEY_CODE.SPACE) || this.showPopup)
        ) {
            let input: any = ev.target,
                value = input.value,
                caretPos = input.selectionEnd,
                posInPx = parseInt(this.canvasCtx.measureText(value.slice(0, caretPos)).width),
                words = value.slice(0, caretPos).split(' '),
                strEnd = value.slice(caretPos),
                word = words.pop(),
                findWords = this.words.filter(el => el.toUpperCase().indexOf(word.toUpperCase()) != -1),
                html
            ;

            words.push('{}');
            this.replaceStr = words.join(' ') + strEnd;

            if (findWords.length) {
                html = findWords.reduce((result, word) => result + `<div class="word-item">${word}</div>`, '');
            } else {
                html = `<div>${this.transNoVariables}</div>`;
            }

            if (!this.wordListEl) {
                const wordListEl = document.createElement('div');
                wordListEl.className = 'word-list';
                this.parentEl.appendChild(wordListEl);
                this.wordListEl = wordListEl;
            }
            this.wordListEl.style.left = `${posInPx}px`;
            this.wordListEl.innerHTML = html;
            this.wordListEl.firstElementChild.classList.add('active');

            this.showPopup = true;
        }
    }

    onBlur(ev) {
        setTimeout(() => this.onRemoveWordListContainer(), 300);
    }

    onAddHint() {
        const hint = document.createElement('div');
        hint.className = 'word-hint';
        setTimeout(() => hint.textContent = this.translateService.instant('wordAutocomplete.hint'), 100);
        this.parentEl.appendChild(hint);
    }

    onRemoveHint() {
        let hint = this.parentEl.querySelector('.word-hint');
        hint && this.parentEl.removeChild(hint);
    }

    private onRemoveWordListContainer() {
        this.wordListEl && this.parentEl.removeChild(this.wordListEl);
        this.wordListEl = null;
        this.showPopup = false;
    }

    private onAddWord(word) {
        this.elementRef.nativeElement.value = this.replaceStr.replace('{}', word);
    }

}
