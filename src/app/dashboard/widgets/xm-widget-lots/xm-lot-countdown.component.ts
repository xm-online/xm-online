import {Component, ElementRef, Input, OnInit} from '@angular/core';
import {EventManager, JhiLanguageService} from "ng-jhipster";
import {Observable} from "rxjs/Observable";
import {Subscription} from "rxjs/Subscription";
import {TweenMax, Quart} from 'gsap';

declare let moment: any;
declare let $: any;

@Component({
    selector: 'xm-lot-countdown',
    templateUrl: './xm-lot-countdown.component.html',
    styles: []
})
export class XmWidgetCountdownComponent implements OnInit{

    @Input() from: string;
    @Input() xmEntityId: string;

    domElements: any;
    private subscription: Subscription;

    constructor(
        private elementRef: ElementRef,
        private jhiLanguageService: JhiLanguageService,
        private eventManager: EventManager,
    ) {
        this.jhiLanguageService.addLocation('widget-lots');
    }

    ngOnInit() {
        this.domElements = {
            days: $(this.elementRef.nativeElement.querySelectorAll('.bloc-time.days .figure')),
            hours: $(this.elementRef.nativeElement.querySelectorAll('.bloc-time.hours .figure')),
            minutes: $(this.elementRef.nativeElement.querySelectorAll('.bloc-time.minutes .figure')),
            seconds: $(this.elementRef.nativeElement.querySelectorAll('.bloc-time.seconds .figure'))
        };
        this.subscription = this.initCountdown(this.from);
    }

    ngOnDestroy() {
        this.subscription && this.subscription.unsubscribe();
    }

    private initCountdown(from: string = new Date().toJSON()): Subscription {
        return Observable.interval(1000).map(() => {
            return moment.duration(moment(from).diff(moment()))
        }).subscribe(result => {
            if (result._milliseconds < 0) {
                this.ngOnDestroy();
                this.eventManager.broadcast({name: 'lotStopCountdown', content: {id: this.xmEntityId}});
            } else {
                this.updateBlock(result.seconds(result), this.domElements['seconds']);
                this.updateBlock(result.minutes(result), this.domElements['minutes']);
                this.updateBlock(result.hours(result), this.domElements['hours']);
                this.updateBlock(result.days(result), this.domElements['days']);
            }
        });
    }

    private updateBlock(value, jQ_el) {
        let jQ_el_1 = jQ_el.eq(0),
            jQ_el_2 = jQ_el.eq(1),
            val_1 = value.toString().charAt(0),
            val_2 = value.toString().charAt(1),
            fig_1_value = jQ_el_1.find('.top').html(),
            fig_2_value = jQ_el_2.find('.top').html();

        if (value >= 10) {

            // Animate only if the figure has changed
            if (fig_1_value !== val_1) this.animateFigure(jQ_el_1, val_1);
            if (fig_2_value !== val_2) this.animateFigure(jQ_el_2, val_2);
        } else {

            // If we are under 10, replace first figure with 0
            if (fig_1_value !== '0') this.animateFigure(jQ_el_1, 0);
            if (fig_2_value !== val_1) this.animateFigure(jQ_el_2, val_1);
        }
    }

    private animateFigure(jQ_el, value) {

        let that = this,
            jQ_top = jQ_el.find('.top'),
            jQ_bottom = jQ_el.find('.bottom'),
            jQ_back_top = jQ_el.find('.top-back'),
            jQ_back_bottom = jQ_el.find('.bottom-back');

        // Before we begin, change the back value
        jQ_back_top.find('span').html(value);

        // Also change the back bottom value
        jQ_back_bottom.find('span').html(value);

        // Then animate
        TweenMax.to(jQ_top, 0.8, {
            rotationX: '-180deg',
            transformPerspective: 300,
            ease: Quart.easeOut,
            onComplete: function () {

                jQ_top.html(value);

                jQ_bottom.html(value);

                TweenMax.set(jQ_top, {rotationX: 0});
            }
        });

        TweenMax.to(jQ_back_top, 0.8, {
            rotationX: 0,
            transformPerspective: 300,
            ease: Quart.easeOut,
            clearProps: 'all'
        });
    }

}
