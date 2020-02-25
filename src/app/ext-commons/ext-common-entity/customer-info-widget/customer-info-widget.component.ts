/* eslint-disable no-unused-expressions */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { XmToasterService } from '@xm-ngx/toaster';
import { JhiEventManager } from 'ng-jhipster';
import { interval, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, map, mergeMap, startWith, take } from 'rxjs/operators';

import { Principal } from '../../../shared';
import { Attachment, AttachmentDetailDialogComponent, AttachmentService, XmEntityService } from '../../../xm-entity';
import { XM_EVENT_LIST } from '../../../xm.constants';

const ATTACHMENT_EVENT = 'attachmentListModification';

@Component({
    selector: 'xm-customer-info-widget',
    templateUrl: './customer-info-widget.component.html',
    styleUrls: ['./customer-info-widget.component.scss'],
})
export class CustomerInfoWidgetComponent implements OnInit, OnDestroy {

    public attachments: Observable<Attachment[]>;
    public showAttachmentLoader: boolean = true;
    public uploadFileEnabled: boolean = false;
    public showCurrencies: boolean = false;
    public form: FormGroup;
    public state: string;
    public config: any;
    public profile: Observable<any>;
    public countries: any[] = [{code: 'US', name: 'United States'}];
    public currencies: string[] = ['USD', 'EUR'];
    private profileId: number;
    private profileSubscription: Subscription;
    private attachmentsSubscription: Subscription;
    private resolveStrategy: string = 'role';
    private profileUpdateInterval: number = 30000;

    constructor(private fb: FormBuilder,
                private principal: Principal,
                private alertService: XmToasterService,
                private eventManager: JhiEventManager,
                private modalService: MatDialog,
                private xmEntityService: XmEntityService,
                private xmAttachmentService: AttachmentService) {
    }

    public ngOnInit(): void {
        if (this.config.resolveStragey) {
            this.resolveStrategy = this.config.resolveStragey;
        }

        if (this.config.currency) {
            this.currencies = this.config.currency;
        }

        if (this.config.countries) {
            this.countries = this.config.countries;
        }

        if (this.config.profileUpdateInterval) {
            this.profileUpdateInterval = this.config.profileUpdateInterval;
        }

        if (this.config.uploadFileEnabled) {
            this.uploadFileEnabled = this.config.uploadFileEnabled;
        }

        if (this.config.showCurrencies) {
            this.showCurrencies = this.config.showCurrencies;
        }

        this.profile = this.xmEntityService.getProfile().pipe(map((responce) => responce.body));
        this.createForm();
        this.resetForm();
        this.attachmentsSubscription = this.eventManager.subscribe(ATTACHMENT_EVENT, (event) => {
            this.showAttachmentLoader = true;
            if (event.profileId || this.profileId) {
                this.attachments = this.xmEntityService.find(event.profileId
                    ? event.profileId : this.profileId, ['attachments'])
                    .pipe(
                        map((entity) => entity.body.attachments),
                        finalize(() => this.showAttachmentLoader = false),
                        catchError(() => {
                            this.showAttachmentLoader = false;
                            return of([]);
                        }));
            } else {
                this.attachments = of([]);
                this.showAttachmentLoader = false;
            }
        });
    }

    public ngOnDestroy(): void {
        this.profileSubscription ? this.profileSubscription.unsubscribe()
            : console.info('no profileSubscription');
        this.attachmentsSubscription ? this.attachmentsSubscription.unsubscribe()
            : console.info('no attachmentsSubscription');
    }

    public createForm(): void {
        this.form = this.fb.group({
            firstName: [null, [Validators.required]],
            lastName: [null, [Validators.required]],
            countryCode: [null, Validators.required],
            locality: [null, [Validators.required]],
            zip: [null, [Validators.required, Validators.pattern(/[0-9]{5,}/)]],
            address1: [null, [Validators.required]],
            address2: [null],
            phone: [null, [Validators.required, Validators.pattern(/^\d{7,}$/)]],
            localCurrency: this.showCurrencies ? [null, Validators.required] : [''],
        });
    }

    public resetForm(): void {
        this.profile.pipe(take(1)).subscribe((profile) => {
            this.profileId = profile.id;
            const [firstName, lastName]: string[] = profile.name.split(/\s+/);
            const {localCurrency = null, registrationAddress = {}}: any = profile.data || {};
            this.form.reset({firstName, lastName, localCurrency, ...registrationAddress});
            this.showAttachmentLoader = true;
            this.attachments = this.xmEntityService.find(profile.id, {embed: 'attachments'})
                .pipe(
                    map((entity) => entity.body.attachments),
                    finalize(() => this.showAttachmentLoader = false),
                    catchError(() => {
                        this.showAttachmentLoader = false;
                        return of([]);
                    }));
            this.runProfileInterval(profile.stateKey);
        });
    }

    public toggleForm(): void {
        this.principal.identity().then((account) => {
            if (this.resolveStrategy === 'state') {
               // empty block
            } else {
                if (account.roleKey === 'UNVERIFIED_CUSTOMER') {
                    this.profileSubscription = interval(this.profileUpdateInterval).pipe(
                        startWith(5000),
                        mergeMap(() => this.profile))
                        .subscribe((p) => this.updateState(p));
                }
            }
        });
    }

    public updateState(profile: any): void {
        if (profile.stateKey !== 'ON-REVIEW' && profile.stateKey !== 'VIDEO-VERIFIED') {
            console.info('[unsubscribe] profile = %s', profile.stateKey);
            this.profileSubscription ? this.profileSubscription.unsubscribe()
                : console.info('no profileSubscription');
        }
        switch (this.state = profile.stateKey) {
            case 'ACTIVE':
                this.alertService.info('nemondo.notification.' + profile.stateKey);
                this.eventManager.broadcast({name: XM_EVENT_LIST.XM_UNAUTHORIZED});
                break;
            case 'EMAIL-VERIFIED':
            case 'UPDATE-NEEDED':
                console.info('[refresh profile state] profile = %s', profile.stateKey);
                this.alertService.info('nemondo.notification.' + profile.stateKey);
                this.form.enable({emitEvent: this.form.disabled});
                break;
            default:
                console.info('[default] profile = %s', profile.stateKey);
                this.form.disable({emitEvent: this.form.enabled});
                break;
        }
    }

    public submitForm(): void {
        if (this.form.valid) {
            this.form.markAsPending();
            this.profile.pipe(take(1)).subscribe((profile) => {
                const {firstName, lastName, localCurrency, ...registrationAddress}: any = this.form.value;
                if (profile.data) {
                    profile.data.registrationAddress = registrationAddress;
                    profile.data.localCurrency = localCurrency;
                } else {
                    profile.data = {registrationAddress, localCurrency};
                }
                profile.name = firstName + ' ' + lastName;
                profile.stateKey = 'ON-REVIEW';
                this.xmEntityService.update(profile).subscribe((p) => {
                    this.alertService.info('tsg.notification.varificationDataSendSuccess');
                    this.updateState(p.body);
                    this.runProfileInterval(p.body.stateKey);
                });
            });
        } else {
            Object.keys(this.form.controls).forEach((control) => {
                this.form.get(control).updateValueAndValidity();
                this.form.get(control).markAsTouched();
                this.form.get(control).markAsDirty();
            });
        }
    }

    public onAddAttachment(): void {
        this.profile.pipe(take(1)).subscribe((profile) => {
            const modalRef = this.modalService.open(AttachmentDetailDialogComponent, {width: '500px'});
            modalRef.componentInstance.xmEntity = profile;
            modalRef.componentInstance.attachmentSpecs = [{key: 'DOCUMENTS.ACCOUNT.USER', name: 'Documents'}];
        });
    }

    public onRemoveAttachment(attachment: any): void {
        this.xmAttachmentService.delete(attachment.id).subscribe(() => {
            if (this.profileId) {
                this.removeEvent(this.profileId);
            } else {
                this.profile.pipe(take(1)).subscribe((profile) => {
                    this.profileId = profile.id;
                    this.removeEvent(this.profileId);
                });
            }
        });
    }

    private runProfileInterval(stateKey: string): void {
        if (stateKey === 'ON-REVIEW' || stateKey === 'VIDEO-VERIFIED') {
            this.profileSubscription = interval(10000).pipe(
                startWith(5000),
                mergeMap(() => this.profile))
                .subscribe((p) => this.updateState(p));
        }
    }

    private removeEvent(profileId: any): void {
        this.alertService.info('tsg.notification.attachmentRemoved');
        this.eventManager.broadcast({
            name: ATTACHMENT_EVENT,
            profileId,
        });
    }
}
