import { Component, OnInit } from '@angular/core';
import { XmEntityService } from '../../../entities/xm-entity/xm-entity.service';
import { TableData } from './md/md-table/md-table.component';
import * as Chartist from 'chartist';
import {JhiLanguageService} from 'ng-jhipster';

declare var $:any;

@Component({
  selector: 'xm-widget-general-countries',
  templateUrl: './xm-widget-general-countries.component.html',
  styleUrls: ['./xm-widget-general-countries.component.css']
})
export class XmWidgetGeneralCountriesComponent implements OnInit {

  config: any;
  tasks: any[];
  public tableData: TableData;

  constructor(
    // private injector: Injector,
    private xmEntityService: XmEntityService,
    private jhiLanguageService: JhiLanguageService) {
    jhiLanguageService.addLocation('widget-general-countries');
    // this.config = this.injector.get('config') || {};
  }


  startAnimationForLineChart(chart){
    var seq, delays, durations;
    seq = 0;
    delays = 80;
    durations = 500;
    chart.on('draw', function(data) {

      if(data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          }
        });
      } else if(data.type === 'point') {
        seq++;
        data.element.animate({
          opacity: {
            begin: seq * delays,
            dur: durations,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq = 0;
  }
  startAnimationForBarChart(chart){
    let seq2, delays2, durations2;
    seq2 = 0;
    delays2 = 80;
    durations2 = 500;
    chart.on('draw', function(data) {
      if(data.type === 'bar'){
        seq2++;
        data.element.animate({
          opacity: {
            begin: seq2 * delays2,
            dur: durations2,
            from: 0,
            to: 1,
            easing: 'ease'
          }
        });
      }
    });

    seq2 = 0;
  }
  // constructor(private navbarTitleService: NavbarTitleService) { }
  public ngOnInit() {
    this.tableData = {
      headerRow: ['ID', 'Name', 'Salary', 'Country', 'City'],
      dataRows: [
        ['US', 'USA', '2.920	', '53.23%'],
        ['DE', 'Germany', '1.300', '20.43%'],
        ['AU', 'Australia', '760', '10.35%'],
        ['GB', 'United Kingdom	', '690', '7.87%'],
        ['RO', 'Romania', '600', '5.94%'],
        ['BR', 'Brasil', '550', '4.34%']
      ]
    };
    /* ----------==========     Daily Sales Chart initialization    ==========---------- */

    const dataDailySalesChart = {
      labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
      series: [
        [12, 17, 7, 17, 23, 18, 38]
      ]
    };

    const optionsDailySalesChart = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    }

    var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);
    /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

    var dataCompletedTasksChart = {
      labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
      series: [
        [230, 750, 450, 300, 280, 240, 200, 190]
      ]
    };

    var optionsCompletedTasksChart = {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0
      }),
      low: 0,
      high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
    }

    var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

    this.startAnimationForLineChart(completedTasksChart);

    /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

    var dataWebsiteViewsChart = {
      labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
      series: [
        [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

      ]
    };
    var optionsWebsiteViewsChart = {
      axisX: {
        showGrid: false
      },
      low: 0,
      high: 1000,
      chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
    };
    var responsiveOptions:any = [
      ['screen and (max-width: 640px)', {
        seriesBarDistance: 5,
        axisX: {
          labelInterpolationFnc: function (value) {
            return value[0];
          }
        }
      }]
    ];
    const websiteViewsChart = new Chartist.Bar('#websiteViewsChart', dataWebsiteViewsChart, optionsWebsiteViewsChart, responsiveOptions);

    this.startAnimationForBarChart(websiteViewsChart);

    const mapData = {
      "AU": 760,
      "BR": 550,
      "CA": 120,
      "DE": 1300,
      "FR": 540,
      "GB": 690,
      "GE": 200,
      "IN": 200,
      "RO": 600,
      "RU": 300,
      "US": 2920,
    };
    $('#worldMap').vectorMap({
      map: 'world_mill_en',
      backgroundColor: "transparent",
      zoomOnScroll: false,
      regionStyle: {
        initial: {
          fill: '#e4e4e4',
          "fill-opacity": 0.9,
          stroke: 'none',
          "stroke-width": 0,
          "stroke-opacity": 0
        }
      },

      series: {
        regions: [{
          values: mapData,
          scale: ["#AAAAAA","#444444"],
          normalizeFunction: 'polynomial'
        }]
      },
    });
  }
  ngAfterViewInit(){
    let breakCards = true;
    if(breakCards == true){
      // We break the cards headers if there is too much stress on them :-)
      $('[data-header-animation="true"]').each(function(){
        var $fix_button = $(this);
        var $card = $(this).parent('.card');
        $card.find('.fix-broken-card').click(function(){
          var $header = $(this).parent().parent().siblings('.card-header, .card-image');
          $header.removeClass('hinge').addClass('fadeInDown');

          $card.attr('data-count',0);

          setTimeout(function(){
            $header.removeClass('fadeInDown animate');
          },480);
        });

        $card.mouseenter(function(){
          var $this = $(this);
          var hover_count = parseInt($this.attr('data-count'), 10) + 1 || 0;
          $this.attr("data-count", hover_count);
          if (hover_count >= 20){
            $(this).children('.card-header, .card-image').addClass('hinge animated');
          }
        });
      });
    }
    //  Activate the tooltips
    $('[rel="tooltip"]').tooltip();
  }

}
