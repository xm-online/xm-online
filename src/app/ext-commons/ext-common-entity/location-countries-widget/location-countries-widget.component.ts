import { AfterViewInit, Component, OnInit } from '@angular/core';

import { TableData } from './md-table.component';

declare const $: any;

@Component({
    selector: 'xm-location-countries-widget',
    templateUrl: './location-countries-widget.component.html',
    styleUrls: ['./location-countries-widget.component.scss'],
})
export class LocationCountriesWidgetComponent implements OnInit, AfterViewInit {

    public config: any;
    public tasks: any[];
    public tableData: TableData;

    public ngOnInit(): void {
        this.tableData = {
            dataRows: [
                ['US', 'USA', '2.920    ', '53.23%'],
                ['DE', 'Germany', '1.300', '20.43%'],
                ['AU', 'Australia', '760', '10.35%'],
                ['GB', 'United Kingdom  ', '690', '7.87%'],
                ['RO', 'Romania', '600', '5.94%'],
                ['BR', 'Brasil', '550', '4.34%'],
            ],
            headerRow: ['ID', 'Name', 'Salary', 'Country', 'City'],
        };

        const mapData = {
            AU: 760,
            BR: 550,
            CA: 120,
            DE: 1300,
            FR: 540,
            GB: 690,
            GE: 200,
            IN: 200,
            RO: 600,
            RU: 300,
            US: 2920,
        };
        $('#worldMap').vectorMap({
            map: 'world_mill_en',
            backgroundColor: 'transparent',
            zoomOnScroll: false,
            regionStyle: {
                initial: {
                    'fill': '#e4e4e4',
                    'fill-opacity': 0.9,
                    'stroke': 'none',
                    'stroke-width': 0,
                    'stroke-opacity': 0,
                },
            },

            series: {
                regions: [{
                    normalizeFunction: 'polynomial',
                    scale: ['#AAAAAA', '#444444'],
                    values: mapData,
                }],
            },
        });
    }

    public ngAfterViewInit(): void {
        const breakCards = true;
        if (breakCards === true) {
            // We break the cards headers if there is too much stress on them :-)
            $('[data-header-animation="true"]').each(function(this: HTMLElement) {
                const $card = $(this).parent('.card');
                $card.find('.fix-broken-card').click(function(this: HTMLElement) {
                    const $header = $(this).parent().parent().siblings('.card-header, .card-image');
                    $header.removeClass('hinge').addClass('fadeInDown');

                    $card.attr('data-count', 0);

                    setTimeout(() => {
                        $header.removeClass('fadeInDown animate');
                    }, 480);
                });

                $card.mouseenter(function(this: HTMLElement) {
                    const $this = $(this);
                    const hoverCount = parseInt($this.attr('data-count'), 10) + 1 || 0;
                    $this.attr('data-count', hoverCount);
                    if (hoverCount >= 20) {
                        $(this).children('.card-header, .card-image').addClass('hinge animated');
                    }
                });
            });
        }
        //  Activate the tooltips
        $('[rel="tooltip"]').tooltip();
    }

}
