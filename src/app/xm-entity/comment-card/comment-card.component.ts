import { Component, Input, OnInit } from '@angular/core';

import { Comment } from '../shared/comment.model';
import { Observable } from 'rxjs';
import { XmEntity } from '../../xm-entity/shared/xm-entity.model';
import { XmEntityService } from '../../xm-entity/shared/xm-entity.service';
import {map} from 'rxjs/operators';

@Component({
    selector: 'xm-comment-card',
    templateUrl: './comment-card.component.html',
    styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {
    @Input() comment: Comment;

    commentator$: Observable<XmEntity>;

    constructor(private entityService: XmEntityService) {
    }

    ngOnInit() {
        this.commentator$ = this.entityService.getProfile(this.comment.userKey).pipe(map(responce => responce.body));
    }
}
