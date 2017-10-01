import {Component, Injector, OnInit} from '@angular/core';
import {TweenMax, Back, Power1} from 'gsap';
import {JhiLanguageService} from 'ng-jhipster';

declare const $: any;

@Component({
    selector: 'xm-redeem-voucher',
    templateUrl: './redeem-voucher.component.html'
})
export class RedeemVoucherComponent implements OnInit {

    private config: any;
    isRedeemSuccess: boolean = false;
    isRedeemError: boolean = false;

    constructor(private injector: Injector,
                private jhiLanguageService: JhiLanguageService) {
        this.config = this.injector.get('config') || {};
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
        $('#secret').inputmask({'mask': '9999 9999 9999 9999', 'placeholder': '0'});

        const numberOfStars = 20;
        for (let i = 0; i < numberOfStars; i++) {
            $('.xm-congrats').append('<div class="blob fa fa-star ' + i + '"></div>');
        }
    }

    reset() {
        $.each($('.blob'), function (i) {
            TweenMax.set($(this), {x: 0, y: 0, opacity: 1});
        });
        TweenMax.set($('h1'), {scale: 1, opacity: 1, rotation: 0});
    }

    animateText() {
        TweenMax.from($('h1'), 0.8, {
            scale: 0.4,
            opacity: 0,
            rotation: 15,
            ease: Back.easeOut.config(4),
        });
    }

    animateBlobs() {
        const xSeed = Math.floor((Math.random() * (380 - 350)) + 350);
        const ySeed = Math.floor((Math.random() * (170 - 120)) + 120);

        $.each($('.blob'), function (i) {
            const $blob = $(this);
            const speed = Math.floor((Math.random() * (5 - 1)) + 1);
            const rotation = Math.floor((Math.random() * (100 - 5)) + 5);
            const scale = (Math.random() * (5 - 1)) + 1;
            const x = Math.floor((Math.random() * 2 * xSeed) - xSeed);
            const y = Math.floor((Math.random() * 2 * ySeed) - ySeed);

            TweenMax.to($blob, speed, {
                x: x,
                y: y,
                ease: Power1.easeOut,
                opacity: 0,
                rotation: rotation,
                scale: scale,
                onStartParams: [$blob],
                onStart: function ($element) {
                    $element.css('display', 'block');
                },
                onCompleteParams: [$blob],
                onComplete: function ($element) {
                    $element.css('display', 'none');
                }
            });
        });
    }

    redeem() {
        this.isRedeemSuccess = true;
        this.isRedeemError = false;

        $('.xm-congrats').css('display', 'block');
        this.reset();
        this.animateText();
        this.animateBlobs();
    }

}
