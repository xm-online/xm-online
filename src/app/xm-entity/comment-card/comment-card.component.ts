import { Component, Input, OnInit } from '@angular/core';

import { User } from '../../shared/user/user.model';
import { UserService } from '../../shared/user/user.service';
import { Comment } from '../shared/comment.model';

@Component({
    selector: 'xm-comment-card',
    templateUrl: './comment-card.component.html',
    styleUrls: ['./comment-card.component.scss']
})
export class CommentCardComponent implements OnInit {

    @Input() comment: Comment;

    noImage: boolean;
    commentator: User;

    constructor(private userService: UserService) {
    }

    ngOnInit() {
        this.loadUserInfo();
    }

    private loadUserInfo() {
        // TODO: move userService to HttpClient
        this.userService.find(this.comment.userKey).subscribe(user => {
            this.commentator = user;
        });
    }

}
