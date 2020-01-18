import { Component, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { User, UserService } from '../../shared';

@Injectable()
export class UserModalService {
    private isOpen: boolean;

    constructor(
        private modalService: NgbModal,
        private router: Router,
        private userService: UserService,
    ) {
        this.isOpen = false;
    }

    public open(component: any, userKey?: string): NgbModalRef | null {
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

    public userModalRef(component: Component, user: User): NgbModalRef {
        const modalRef: any = this.modalService.open(component, {size: 'lg', backdrop: 'static'});
        modalRef.componentInstance.user = user;
        modalRef.result.then(() => {
            this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true});
            this.isOpen = false;
        }, () => {
            this.router.navigate([{outlets: {popup: null}}], {replaceUrl: true});
            this.isOpen = false;
        });
        return modalRef;
    }
}
