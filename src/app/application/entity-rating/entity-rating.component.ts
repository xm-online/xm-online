import {Component, Input, OnInit} from '@angular/core';
import {JhiLanguageService} from "ng-jhipster";
import {XmEntity} from "../../entities/xm-entity/xm-entity.model";
import {XmEntityService} from "../../entities/xm-entity/xm-entity.service";
import {XmEntitySpecService} from "../../shared/spec/spec.service";
import {Vote} from "../../entities/vote/vote.model";
import {VoteService} from '../../entities/vote/vote.service';
import {Rating} from "../../entities/rating/rating.model";
import {RatingService} from '../../entities/rating/rating.service';

declare let swal: any;

@Component({
    selector: 'xm-rating-cmp',
    template: `
      <div *ngFor="let rating of ratings">
        <div [ngSwitch]="rating.style">
          <div *ngSwitchCase="'5STARS'">
            <rating [(ngModel)]="numberOfStars" [float]="true" (ngModelChange)="onChange($event, rating, rating.key)"></rating>
            <div>{{numberOfVotes}} <span jhiTranslate="xm.xmEntity.votes">votes</span></div>
          </div>
        </div>
      </div>
    `
})
export class EntityRatingComponent implements OnInit {

    @Input() xmEntityId: number;

    xmEntity: XmEntity;
    rating: Rating;
    ratings: any[];
    numberOfVotes: number = 0;
    numberOfStars: number = 0;

    constructor(
        private xmEntityService: XmEntityService,
        private xmEntitySpecService: XmEntitySpecService,
        private ratingService: RatingService,
        private voteService: VoteService,
        private jhiLanguageService: JhiLanguageService,
    ) {
      this.jhiLanguageService.addLocation('rating');
      this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
        this.load();
    }

    onChange(voteValue: number, rating: any, typeKey: string) {
        const vote: Vote = new Vote(undefined, '', voteValue, voteValue + ' stars', new Date().toJSON(), undefined, this.xmEntity);
        if (!this.xmEntity.ratings) {
            const rating: Rating = new Rating(undefined, typeKey, undefined, new Date().toJSON(), undefined, this.xmEntity, undefined);
            this.addRating(rating, vote);
        } else {
            vote.rating = rating.rating;
            this.addVote(vote);
        }
    }

    private load() {
        this.xmEntityService.find(this.xmEntityId)
            .subscribe(xmEntity => {
                const typeKey = xmEntity.typeKey;

                this.xmEntity = xmEntity;
                this.ratings = this.xmEntitySpecService.getRatings(typeKey);

                if (xmEntity.ratings && xmEntity.ratings.length) {
                    this.ratings.forEach(item => {
                        if (item.style === '5STARS') {
                            item.rating = xmEntity.ratings.find(el => el.typeKey == item.key);
                            item.rating && this.voteService.search({query: `rating.id:${item.rating.id}`}).subscribe(
                                (resp: any) => {
                                    if (resp._body && resp._body.length) {
                                        this.numberOfVotes = resp._body.length;
                                        this.numberOfStars = resp._body.reduce((sum, el) => sum + el.value, 0);
                                        this.numberOfStars /= this.numberOfVotes;
                                    }
                                },
                                (res: Response) => console.log(res));
                        }
                    });
                }
            })
    }

    private addRating(xmRating: Rating, xmVote: Vote) {
        this.ratingService.create(xmRating).subscribe((resp: Rating) => {
            xmVote.rating = resp;
            this.addVote(xmVote);
        }, (resp: Response) => console.log('ERROR: Rating not added.'));
    }

    private addVote(xmVote: Vote) {
        this.voteService.create(xmVote).subscribe((resp: Vote) => {
            this.load();
            swal({
                title: 'Your vote accepted!',
                buttonsStyling: false,
                confirmButtonClass: 'btn btn-primary'
            });
        }, (resp: Response) => console.log('ERROR: Vote not added.'));
    }

}
