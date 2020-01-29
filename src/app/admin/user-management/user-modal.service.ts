import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatDialogRef } from '@angular/material/dialog/typings/dialog-ref';
import { Router } from '@angular/router';


import { User, UserService } from '../../shared';

@Injectable()
export class UserModalService {
    private isOpen: boolean;

    constructor(
        private modalService: MatDialog,
        private router: Router,
        private userService: UserService,
    ) {
        this.isOpen = false;
    }

    public open(component: any, userKey?: string): MatDialogRef<any> | null {
        if (this.isOpen) {
            return null;
        }
        this.isOpen = true;

        if (userKey) {
            this.userService.find(userKey).subscribe((user) => this.userModalRef(component, user),
                () => {
                    this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true});
                    this.isOpen = false;
                });
            return null;
        } else {
            return this.userModalRef(component, new User());
        }
    }

    public userModalRef(component: any, user: User): MatDialogRef<any> {
        const modalRef = this.modalService.open<any>(component, {width: '500px'});
        modalRef.componentInstance.user = user;
        modalRef.afterClosed().subscribe(() => {
            this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true});
            this.isOpen = false;
        }, () => {
            this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true});
            this.isOpen = false;
        });
        return modalRef;
    }
}
