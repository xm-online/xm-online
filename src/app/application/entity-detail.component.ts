import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Rx';
import {EventManager, JhiLanguageService} from 'ng-jhipster';
import {XmEntity} from '../entities/xm-entity/xm-entity.model';
import {XmEntityService} from '../entities/xm-entity/xm-entity.service';
import {XmEntitySpecService} from '../shared/spec/spec.service';
import {UserService} from '../shared/user/user.service';
import {JhiLanguageHelper} from 'app/shared';
import {I18nNamePipe} from "../shared/language/i18n-name.pipe";
import {Principal} from "../shared/auth/principal.service";

@Component({
    selector: 'xm-entity-detail',
    templateUrl: './entity-detail.component.html'
})
export class EntityDetailComponent implements OnInit, OnDestroy {

    items: any = [{},{},{},{}];

    xmEntity: XmEntity;
    type: any;
    state: any;
    ratings: any[];
    nextStates: any[];
    functions: any[];
    formData: any;
    attachmentTypes: any;
    locationTypes: any;
    linkTypes: any;
    commentTypes: any[];
    file: File;
    isTagsAvailable: boolean;
    private routeData: any;
    private eventSubscriber: Subscription;
    private routeParamsSubscription: any;
    private routeDataSubscription: Subscription;

    constructor(
          private eventManager: EventManager,
          private jhiLanguageHelper: JhiLanguageHelper,
          private jhiLanguageService: JhiLanguageService,
          private xmEntityService: XmEntityService,
          private xmEntitySpecService: XmEntitySpecService,
          private userService: UserService,
          private route: ActivatedRoute,
          private i18nNamePipe: I18nNamePipe,
          private principal: Principal,
    ) {
        this.jhiLanguageService.addLocation('xmEntity');
    }

    ngOnInit() {
        this.routeDataSubscription = this.route.data.subscribe((data) => {
            this.routeData = data;
        });
        this.routeParamsSubscription = this.route.params.subscribe((params) => {
            if (params.key) {
                this.xmEntitySpecService.getEntityType()
                    .then(result => {
                        let type = this.xmEntitySpecService.getType(params.key) || {};
                        if (type && type.name) {
                            this.routeData.pageSubTitle = this.i18nNamePipe.transform(type.name, this.principal);
                        }
                    });
            }
            this.load(params['id']);
        });
        this.registerChangeInXmEntities();
    }

    ngOnDestroy() {
        this.routeParamsSubscription.unsubscribe();
        this.routeDataSubscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    private registerChangeInXmEntities() {
        this.eventSubscriber = this.eventManager.subscribe('xmEntityDetailModification', (response) => this.load(this.xmEntity.id));
    }

    private load(id) {
        this.xmEntityService.find(id).subscribe((xmEntity) => {
            const typeKey = xmEntity.typeKey;
            this.xmEntity = xmEntity;
            this.xmEntitySpecService.getEntityType()
                .then(result => {
                    this.type = this.xmEntitySpecService.getType(typeKey) || {};
                    this.state = this.xmEntitySpecService.getState(typeKey, xmEntity.stateKey);
                    this.ratings = this.xmEntitySpecService.getRatings(typeKey);
                    this.nextStates = this.xmEntitySpecService.getNextStates(typeKey, xmEntity.stateKey);
                    this.functions = this.xmEntitySpecService.getFunctions(typeKey);
                    this.attachmentTypes = this.xmEntitySpecService.getAttachments(typeKey);
                    this.locationTypes = this.xmEntitySpecService.getLocations(typeKey);
                    this.linkTypes = this.xmEntitySpecService.getLinkTypes(typeKey);
                    this.commentTypes = this.typesSpecToArray(this.xmEntitySpecService.getCommentTypes(typeKey));

                    this.formData = this.xmEntitySpecService.getFormData(typeKey);
                    
                    this.isTagsAvailable = !!this.type.tags;
                });

            this.loadUserInfo();

            this.routeData.pageSubSubTitle = this.xmEntity.name;
            this.jhiLanguageHelper.updateTitle();
        });
    }

    fileUpload(event) {
        if (event.target) {
            this.file = event.target.files[0];
        } else {
            this.file = event.srcElement.files[0];
        }
        this.xmEntityService.uploadAvatar(this.xmEntity, this.file).subscribe((res: String) =>
            console.log('Result: ' + res), (res: Response) => console.log(res));

    }

    private loadUserInfo() {

        if (this.xmEntity.comments) {
            this.xmEntity.comments.map(comment => {
                let userKey = "" + comment.userKey;
                this.userService.find(userKey).subscribe(user => {
                    comment.user = user;
                });
            });
        }
    }

    private typesSpecToArray(types) {
        return types ? Object.keys(types).map(key => types[key]) : [];
    }

}
