import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, HostListener, Input, NgModule, OnInit, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';

@Component({
    selector: 'rating',
    template: `
        <span (mouseleave)="resetHovered()"
              (focus)="onTouched()"
              class="rating"
              [class.disabled]="disabled"
              [class.readonly]="readonly"
              tabindex="0"
              role="slider"
              aria-valuemin="0"
              [attr.aria-valuemax]="ratingRange.length"
              [attr.aria-valuenow]="model">
    <span *ngFor="let item of ratingRange; let index = index">
        <i (mouseenter)="setHovered(item)"
           (mousemove)="changeHovered($event)"
           (click)="rate(item)"
           [attr.data-icon]="fullIcon"
           class="{{ iconClass }} half{{ calculateWidth(item) }}"
           [title]="titles[index] || item">{{ emptyIcon }}</i>
    </span>
</span>
    `,
    providers: [
        {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => Rating), multi: true},
        {provide: NG_VALIDATORS, useExisting: forwardRef(() => Rating), multi: true},
    ],
    styles: [
            `
            span.rating {
                cursor: pointer;
                outline: none;
            }

            span.rating.readonly {
                cursor: default;
            }

            span.rating.disabled {
                cursor: not-allowed;
            }

            span.rating i {
                font-style: normal;
            }

            .star-icon {
                color: #ddd;
                font-size: 2em;
                position: relative;
            }

            .star-icon:before {
                color: #FDE16D;
                content: attr(data-icon) " ";
                position: absolute;
                left: 0;
                overflow: hidden;
                width: 0;
            }

            span.rating.disabled .star-icon:before {
                color: #ECECEC;
                text-shadow: none;
            }

            .star-icon.half10:before {
                width: 10%;
            }

            .star-icon.half20:before {
                width: 20%;
            }

            .star-icon.half30:before {
                width: 30%;
            }

            .star-icon.half40:before {
                width: 40%;
            }

            .star-icon.half50:before {
                width: 50%;
            }

            .star-icon.half60:before {
                width: 60%;
            }

            .star-icon.half70:before {
                width: 70%;
            }

            .star-icon.half80:before {
                width: 80%;
            }

            .star-icon.half90:before {
                width: 90%;
            }

            .star-icon.half100:before {
                width: 100%;
            }

            @-moz-document url-prefix() { /* Firefox Hack */
                .star-icon {
                    font-size: 50px;
                    line-height: 34px;
                }
            }
        `,
    ],
})
export class Rating implements OnInit, ControlValueAccessor, Validator {

    /*
     * -------------------------------------------------------------------------
     * Inputs
     * -------------------------------------------------------------------------
     */

    @Input()
    public iconClass: string = 'star-icon';

    @Input()
    public fullIcon: string = '★';

    @Input()
    public emptyIcon: string = '☆';

    @Input()
    public readonly: boolean;

    @Input()
    public disabled: boolean;

    @Input()
    public required: boolean;

    @Input()
    public float: boolean;

    @Input()
    public titles: string[] = [];

    /*
     * -------------------------------------------------------------------------
     * Input Accessors
     * -------------------------------------------------------------------------
     */
    @Output()
    public onHover: EventEmitter<any> = new EventEmitter();
    @Output()
    public onLeave: EventEmitter<any> = new EventEmitter();

    /*
     * -------------------------------------------------------------------------
     * Outputs
     * -------------------------------------------------------------------------
     */
    public model: number;
    public ratingRange: number[];

    /*
     * -------------------------------------------------------------------------
     * Public properties
     * -------------------------------------------------------------------------
     */
    public hovered: number = 0;
    public hoveredPercent: number = undefined;
    public onTouched: (m?: any) => void;
    private onChange: (m: any) => void;

    /*
     * -------------------------------------------------------------------------
     * Private Properties
     * -------------------------------------------------------------------------
     */

    private _max: number = 5;

    public get max(): number {
        return this._max;
    }

    @Input()
    public set max(max: number) {
        this._max = max;
        this.buildRanges();
    }

    /*
     * -------------------------------------------------------------------------
     * Implemented from ControlValueAccessor
     * -------------------------------------------------------------------------
     */

    public writeValue(value: number): void {
        /*
         *If (value % 1 !== value) {
         *this.model = Math.round(value);
         *return;
         *}
         */

        this.model = value;
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /*
     * -------------------------------------------------------------------------
     * Implemented from Va..
     * -------------------------------------------------------------------------
     */

    public validate(c: AbstractControl): any {
        if (this.required && !c.value) {
            return {
                required: true,
            };
        }
        return null;
    }

    /*
     * -------------------------------------------------------------------------
     * Lifecycle callbacks
     * -------------------------------------------------------------------------
     */

    public ngOnInit(): void {
        this.buildRanges();
    }

    /*
     * -------------------------------------------------------------------------
     * Host Bindings
     * -------------------------------------------------------------------------
     */

    @HostListener('keydown', ['$event'])
    public onKeydown(event: KeyboardEvent): void {
        if (![37, 38, 39, 40].includes(event.which) || this.hovered)
            return;

        event.preventDefault();
        event.stopPropagation();
        const increment = this.float ? 0.5 : 1;
        this.rate(this.model + (event.which === 38 || event.which === 39 ? increment : increment * -1));
    }

    /*
     * -------------------------------------------------------------------------
     * Public Methods
     * -------------------------------------------------------------------------
     */

    public calculateWidth(item: number): any {
        if (this.hovered > 0) {
            if (this.hoveredPercent !== undefined && this.hovered === item)
                return this.hoveredPercent;

            return this.hovered >= item ? 100 : 0;
        }
        return this.model >= item ? 100 : 100 - Math.round((item - this.model) * 10) * 10;
    }

    public setHovered(hovered: number): void {
        if (!this.readonly && !this.disabled) {
            this.hovered = hovered;
            this.onHover.emit(hovered);
        }
    }

    public changeHovered(event: MouseEvent): void {
        if (!this.float) return;
        const target = event.target as HTMLElement;
        const relativeX = event.pageX - target.offsetLeft;
        const percent = Math.round((relativeX * 100 / target.offsetWidth) / 10) * 10;
        this.hoveredPercent = percent > 50 ? 100 : 50;
    }

    public resetHovered(): void {
        this.hovered = 0;
        this.hoveredPercent = undefined;
        this.onLeave.emit(this.hovered);
    }


    public rate(value: number): void {
        if (!this.readonly && !this.disabled && value >= 0 && value <= this.ratingRange.length) {
            const newValue = this.hoveredPercent ? (value - 1) + this.hoveredPercent / 100 : value;
            this.onChange(newValue);
            this.model = newValue;
        }
    }

    /*
     * -------------------------------------------------------------------------
     * Private Methods
     * -------------------------------------------------------------------------
     */

    private buildRanges(): void {
        this.ratingRange = this.range(1, this.max);
    }

    private range(start: number, end: number) {
        const foo: number[] = [];
        for (let i = start; i <= end; i++) {
            foo.push(i);
        }
        return foo;
    }

}

@NgModule({
    imports: [CommonModule],
    declarations: [Rating],
    exports: [Rating],
})
export class RatingModule {

}
