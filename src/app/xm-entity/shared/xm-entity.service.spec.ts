import { JhiDateUtils } from 'ng-jhipster';
import { Observable } from 'rxjs/Observable';
import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {XmEntityService} from './xm-entity.service';
import {SERVER_API_URL} from '../../xm.constants';

describe('XmEntityService', () => {

    const v2ResourceUrl = SERVER_API_URL + 'entity/api/v2/xm-entities';
    const resourceUrl = SERVER_API_URL + 'entity/api/xm-entities';
    const resourceSearchUrl = SERVER_API_URL + 'entity/api/_search/xm-entities';
    const resourceAvatarUrl = SERVER_API_URL + 'entity/api/storage/objects';
    const resourceProfileUrl = SERVER_API_URL + 'entity/api/profile';
    const resourceSearchTemplateUrl = SERVER_API_URL + 'entity/api/_search-with-template/xm-entities';
    const getEntitiesByIdUrl = `entity/api/xm-entities-by-ids`;

    let service: XmEntityService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                XmEntityService,
                JhiDateUtils
            ]
        });
        httpTestingController = TestBed.get(HttpTestingController);
        service  = TestBed.get(XmEntityService);
    });

    describe('serchApi', () => {
        it('should call find() with correct url', () => {
            const id = 123;
            service.find(id).subscribe((data) => {});
            const req = httpTestingController.expectOne(SERVER_API_URL + resourceUrl + '/' + id);
            req.flush({id: 123});
            httpTestingController.verify();
        });

        it('should call getEntitiesByIds() with correct url', () => {
            service.getEntitiesByIds().subscribe((data) => {});
            const req = httpTestingController.expectOne(getEntitiesByIdUrl);
            req.flush({id: 123});
            httpTestingController.verify();
        });

        it('should call query() with correct url', () => {
            service.query().subscribe((data) => {});
            const req = httpTestingController.expectOne(resourceUrl);
            req.flush({id: 123});
            httpTestingController.verify();
        });

        it('should call search() with correct url', () => {
            service.search().subscribe((data) => {});
            const req = httpTestingController.expectOne(resourceSearchUrl);
            req.flush({id: 123});
            httpTestingController.verify();
        });

        it('should call searchByTemplate() with correct url', () => {
            service.searchByTemplate().subscribe((data) => {});
            const req = httpTestingController.expectOne(resourceSearchTemplateUrl);
            req.flush({id: 123});
            httpTestingController.verify();
        });

        it('should call getProfile() with correct url', () => {
            service.getProfile().subscribe((data) => {});
            const req = httpTestingController.expectOne(resourceProfileUrl);
            req.flush({id: 123});
            httpTestingController.verify();
        });

        it('should call findLinkTargets() with correct url', () => {
            const id = 123;
            const linkType = 'test;'
            service.findLinkTargets(id, linkType).subscribe((data) => {});
            const req = httpTestingController.expectOne(`${resourceUrl}/${id}/links/targets?typeKey=${linkType}`);
            req.flush({id: 123});
            httpTestingController.verify();
        });

        it('should call findLinkSources() with correct url', () => {
            const id = 123;
            const linkType = 'test;'
            service.findLinkSources(id, linkType).subscribe((data) => {});
            const req = httpTestingController.expectOne(`${resourceUrl}/${id}/links/sources?typeKey=${linkType}`);
            req.flush({id: 123});
            httpTestingController.verify();
        });

        it('should call findLinkSourcesInverted() with correct url', () => {
            const idOrKey = '123';
            const linkType = ['test'];
            service.findLinkSourcesInverted(idOrKey, linkType).subscribe((data) => {});
            const req = httpTestingController.expectOne(`${v2ResourceUrl}/${idOrKey}/links/sources?typeKeys=${linkType}`);
            req.flush({id: 123});
            httpTestingController.verify();
        });

    });

    xit('should call create with correct url', () => {
        expect(true).toBeTruthy();
    });

    xit('should call update with correct url', () => {
        expect(true).toBeTruthy();
    });

    xit('should call delete with correct url', () => {
        expect(true).toBeTruthy();
    });

});
