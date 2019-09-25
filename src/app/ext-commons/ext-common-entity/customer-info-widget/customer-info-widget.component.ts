import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JhiAlertService, JhiEventManager } from 'ng-jhipster';
import { interval, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, map, mergeMap, startWith, take } from 'rxjs/operators';

import { Principal } from '../../../shared';
import {
    Attachment,
    AttachmentDetailDialogComponent,
    AttachmentService,
    AttachmentSpec,
    XmEntityService
} from '../../../xm-entity';
import { XM_EVENT_LIST } from '../../../xm.constants';

const ATTACHMENT_EVENT = 'attachmentListModification';

@Component({
    selector: 'xm-customer-info-widget',
    templateUrl: './customer-info-widget.component.html',
    styleUrls: ['./customer-info-widget.component.scss']
})
export class CustomerInfoWidgetComponent implements OnInit, OnDestroy {

    private profileId;
    private profileSubscription: Subscription;
    private attachmentsSubscription: Subscription;
    private resolveStrategy = 'role';
    private profileUpdateInterval = 30000;
    public attachments: Observable<Attachment[]>;
    public showAttachmentLoader = true;

    uploadFileEnabled = false;
    showCurrencies = false;
    form: FormGroup;
    state: string;
    config: any;
    profile: Observable<any>;
    countries = [{code: 'US', name: 'United States'}];
    currencies = ['USD', 'EUR'];


    constructor(private fb: FormBuilder,
                private injector: Injector,
                private principal: Principal,
                private alertService: JhiAlertService,
                private eventManager: JhiEventManager,
                private modalService: NgbModal,
                private xmEntityService: XmEntityService,
                private xmAttachmentService: AttachmentService) {
    }

    ngOnInit(): void {
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

        this.profile = this.xmEntityService.getProfile().pipe(map(responce => responce.body));
        this.createForm();
        this.resetForm();
        this.attachmentsSubscription = this.eventManager.subscribe(ATTACHMENT_EVENT, event => {
            this.showAttachmentLoader = true;
            if (event.profileId || this.profileId) {
                this.attachments = this.xmEntityService.find(event.profileId ? event.profileId : this.profileId, ['attachments'])
                    .pipe(
                        map(entity => entity.body.attachments),
                        finalize(() => this.showAttachmentLoader = false),
                        catchError(() => {
                            this.showAttachmentLoader = false;
                            return of([])
                        }));
            } else {
                this.attachments = of([]);
                this.showAttachmentLoader = false;
            }
        })
    }

    ngOnDestroy() {
        this.profileSubscription ? this.profileSubscription.unsubscribe() : console.log('no profileSubscription');
        this.attachmentsSubscription ? this.attachmentsSubscription.unsubscribe() : console.log('no attachmentsSubscription');
    }

    createForm(): void {
        this.form = this.fb.group({
            firstName: [null, [Validators.required]],
            lastName: [null, [Validators.required]],
            countryCode: [null, Validators.required],
            locality: [null, [Validators.required]],
            zip: [null, [Validators.required, Validators.pattern(/[0-9]{5,}/)]],
            address1: [null, [Validators.required]],
            address2: [null],
            phone: [null, [Validators.required, Validators.pattern(/^\d{7,}$/)]],
            localCurrency: this.showCurrencies ? [null, Validators.required] : ['']
        });
    }

    resetForm(): void {
        this.profile.pipe(take(1)).subscribe(profile => {
            this.profileId = profile.id;
            const [firstName, lastName] = profile.name.split(/\s+/);
            const {localCurrency = null, registrationAddress = {}} = profile.data || {};
            this.form.reset({firstName, lastName, localCurrency, ...registrationAddress});
            this.showAttachmentLoader = true;
            this.attachments = this.xmEntityService.find(profile.id, {'embed': 'attachments'})
                .pipe(
                    map(entity => entity.body.attachments),
                    finalize(() => this.showAttachmentLoader = false),
                    catchError(() => {
                        this.showAttachmentLoader = false;
                        return of([])
                    }));
            this.runProfileInterval(profile.stateKey);
        });
    }

    toggleForm(): void {
        this.principal.identity().then(account => {
            if (this.resolveStrategy === 'state') {

            } else {
                if (account.roleKey === 'UNVERIFIED_CUSTOMER') {
                    this.profileSubscription = interval(this.profileUpdateInterval).pipe(startWith(5000), mergeMap(() => this.profile))
                        .subscribe(p => this.updateState(p));
                }
            }
        });
    }

    updateState(profile: any) {
        // console.log('[refresh profile state] profile = %o', profile);
        if (profile.stateKey !== 'ON-REVIEW' && profile.stateKey !== 'VIDEO-VERIFIED') {
            console.log('[unsubscribe] profile = %s', profile.stateKey);
            this.profileSubscription ? this.profileSubscription.unsubscribe() : console.log('no profileSubscription');
        }
        switch (this.state = profile.stateKey) {
            case 'ACTIVE':
                this.alertService.info('nemondo.notification.' + profile.stateKey);
                this.eventManager.broadcast({name: XM_EVENT_LIST.XM_UNAUTHORIZED});
                break;
            case 'EMAIL-VERIFIED':
            case 'UPDATE-NEEDED':
                console.log('[refresh profile state] profile = %s', profile.stateKey);
                this.alertService.info('nemondo.notification.' + profile.stateKey);
                this.form.enable({emitEvent: this.form.disabled});
                break;
            default:
                console.log('[default] profile = %s', profile.stateKey);
                this.form.disable({emitEvent: this.form.enabled});
                break;
        }
    }

    submitForm(): void {
        if (this.form.valid) {
            this.form.markAsPending();
            this.profile.pipe(take(1)).subscribe(profile => {
                const {firstName, lastName, localCurrency, ...registrationAddress} = this.form.value;
                if (profile.data) {
                    profile.data.registrationAddress = registrationAddress;
                    profile.data.localCurrency = localCurrency;
                } else {
                    profile.data = {registrationAddress, localCurrency};
                }
                profile.name = firstName + ' ' + lastName;
                profile.stateKey = 'ON-REVIEW';
                this.xmEntityService.update(profile).subscribe(p => {
                    this.alertService.info('tsg.notification.varificationDataSendSuccess');
                    this.updateState(p.body);
                    this.runProfileInterval(p.body.stateKey);
                });
            });
        } else {
            Object.keys(this.form.controls).forEach(control => {
                this.form.get(control).updateValueAndValidity();
                this.form.get(control).markAsTouched();
                this.form.get(control).markAsDirty();
            });
        }
    }

    private runProfileInterval(stateKey: string) {
        if (stateKey === 'ON-REVIEW' || stateKey === 'VIDEO-VERIFIED') {
            this.profileSubscription = interval(10000).pipe(startWith(5000), mergeMap(() => this.profile))
                .subscribe(p => this.updateState(p));
        }
    }

    onAddAttachment() {
        this.profile.pipe(take(1)).subscribe(profile => {
            const modalRef = this.modalService.open(AttachmentDetailDialogComponent, {backdrop: 'static'});
            modalRef.componentInstance.xmEntity = profile;
            modalRef.componentInstance.attachmentSpecs = [{key: 'DOCUMENTS.ACCOUNT.USER', name: 'Documents'}];
        })
    }

    private removeEvent(profileId) {
        this.alertService.info('tsg.notification.attachmentRemoved');
        this.eventManager.broadcast({
            name: ATTACHMENT_EVENT,
            profileId: profileId
        });
    }

    onRemoveAttachment(attachment) {
        this.xmAttachmentService.delete(attachment.id).subscribe(() => {
            if (this.profileId) {
                this.removeEvent(this.profileId);
            } else {
                this.profile.pipe(take(1)).subscribe(profile => {
                    this.profileId = profile.id;
                    this.removeEvent(this.profileId);
                });
            }
        });
    }
}
