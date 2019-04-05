import { Component, Input, OnInit } from '@angular/core';

import { User } from '../../shared/user/user.model';
import { UserService } from '../../shared/user/user.service';
import { Comment } from '../shared/comment.model';
import {Principal} from '../../shared';
import {Observable} from 'rxjs';

@Component({
    selector: 'xm-comment-card',
    templateUrl: './comment-card.component.html',
    styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {
    @Input() comment: Comment;

    commentator$: Observable<User>;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.commentator$ = this.userService.find(this.comment.userKey);
    }
}
