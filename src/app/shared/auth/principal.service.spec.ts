import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { XmSharedTestingModule } from '@xm-ngx/shared';
import { JhiAlertService } from 'ng-jhipster';
import { LocalStorageService, SessionStorageService } from 'ngx-webstorage';
import { of } from 'rxjs/observable/of';
import { AccountService } from './account.service';
import { Principal } from './principal.service';

describe('PrincipalService', () => {

    let mockAlertService;
    let mockAccountService;
    let mockLocalStorage;
    let mockSessionStorage;
    let service: Principal;

    const mockedUser = {
        body: {
            id: 1,
            name: 'Iron man', imageUrl: 'someUrl', firstName: 'Tony', lastName: 'Stark',
            langKey: 'en', userKey: 'userKey',
            permissions: [{privilegeKey: 'CAN_WALK', enabled: true}, {privilegeKey: 'CAN_FLY', enabled: true}],
        },
    };

    beforeEach(() => {
        mockAlertService = jasmine.createSpyObj(['warning']);
        mockAccountService = jasmine.createSpyObj(['get']);
        mockLocalStorage = jasmine.createSpyObj(['retrieve']);
        mockSessionStorage = jasmine.createSpyObj(['retrieve']);

        mockAccountService.get.and.returnValue(of(mockedUser));

        TestBed.configureTestingModule({
            imports: [XmSharedTestingModule, HttpClientTestingModule],
            providers: [
                Principal,
                {provide: AccountService, useValue: mockAccountService},
                {provide: JhiAlertService, useValue: mockAlertService},
                {provide: LocalStorageService, useValue: mockLocalStorage},
                {provide: SessionStorageService, useValue: mockSessionStorage},
            ],
        });
        service = TestBed.get(Principal);
    });

    describe('isAuthenticated()', () => {
        it('should return false if identity not set', () => {
            expect(service.isAuthenticated()).toBe(false);
        });
        it('should be true if identity set', () => {
            service.identity().then(() => {
                expect(service.isAuthenticated()).toBe(true);
            });
        });
    });

    describe('logout()', () => {
        it('should do nothing if identity not set not set', () => {
            service.logout();
            expect(service.isAuthenticated()).toBe(false);
        });
        it('should return false after user logout', () => {
            expect(service.isAuthenticated()).toBe(false);
            service.identity().then(() => {
                expect(service.isAuthenticated()).toBe(true);
                service.logout();
                expect(service.isAuthenticated()).toBe(false);
            });
        });
    });

    describe('getName()', () => {
        it('should return null if identity not set', () => {
            expect(service.getName()).toBeNull();
        });
        it('should return first and second name', () => {
            service.identity().then(() => {
                expect(service.getName()).toBe('Tony Stark');
            });
        });
    });

    describe('getLangKey()', () => {
        it('should return null if identity not set', () => {
            expect(service.getLangKey()).toBeNull();
        });
        it('should return lang key', () => {
            service.identity().then(() => {
                expect(service.getLangKey()).toBe('en');
            });
        });
    });

    describe('setLangKey()', () => {
        it('should do nothing if identity not set', () => {
            service.setLangKey('en');
            expect(service.getLangKey()).toBeNull();
        });
        it('should se lang if identity set', () => {
            service.identity().then(() => {
                expect(service.getLangKey()).toBe('en');
                service.setLangKey('qw');
                expect(service.getLangKey()).toBe('qw');
            });
        });
    });

    describe('getUserKey()', () => {
        it('should return null if identity not set', () => {
            expect(service.getUserKey()).toBeNull();
        });
        it('should return user key', () => {
            service.identity().then(() => {
                expect(service.getUserKey()).toBe('userKey');
            });
        });
    });

    describe('getImageUrl()', () => {
        it('should return null if identity not set', () => {
            expect(service.getImageUrl()).toBeNull();
        });
        it('should return image url', () => {
            service.identity().then(() => {
                expect(service.getImageUrl()).toBe('someUrl');
            });
        });
    });

    describe('hasPrivileges()', () => {

        it('should return false if identity not set', () => {
            expect(service.isAuthenticated()).toBeFalsy();
            service.hasPrivileges().then((value) => {
                expect(value).toBeFalsy();
            });
        });

        it('should return false if stategy is not AND | OR', () => {
            expect(service.isAuthenticated()).toBeFalsy();
            service.hasPrivileges().then(() => {
                service.hasPrivileges(['CAN_FLY'], 'XOR').then((value) => expect(value).toBeFalsy());
            });
        });

        describe('OR strategy', () => {
            it('should return true for CAN_FLY or CAN_WALK or any of them', () => {
                expect(service.isAuthenticated()).toBeFalsy();
                service.identity().then(() => {
                    expect(service.isAuthenticated()).toBeTruthy();
                    service.hasPrivileges(['CAN_FLY']).then((value) => expect(value).toBeTruthy());
                    service.hasPrivileges(['CAN_WALK']).then((value) => expect(value).toBeTruthy());
                    service.hasPrivileges(['CAN_WALK', 'CAN_FLY']).then((value) => expect(value).toBeTruthy());
                });
            });

            it('should return false for CAN_SWIM', () => {
                expect(service.isAuthenticated()).toBeFalsy();
                service.identity().then(() => {
                    expect(service.isAuthenticated()).toBeTruthy();
                    service.hasPrivileges(['CAN_SWIM']).then((value) => expect(value).toBeFalsy());
                });
            });

        });

        describe('AND strategy', () => {
            it('should return empty if permissions present', () => {
                expect(service.isAuthenticated()).toBeFalsy();
                service.identity().then(() => {
                    expect(service.isAuthenticated()).toBeTruthy();
                    service.hasPrivileges(['CAN_WALK', 'CAN_FLY'], 'AND').then((value) => {
                        expect(value.length).toBe(0);
                    });
                    service.hasPrivileges(['CAN_WALK'], 'AND')
                        .then((value) => expect(value.length).toBe(0));
                    service.hasPrivileges(['CAN_FLY'], 'AND')
                        .then((value) => expect(value.length).toBe(0));
                });
            });

            it('should return list of not assigned permissions', () => {
                expect(service.isAuthenticated()).toBeFalsy();
                service.identity().then(() => {
                    expect(service.isAuthenticated()).toBeTruthy();
                    const bulsitBingoArray = ['CAN_WALK', 'CAN_FLY',
                        'CAN_SWIM', 'CAN_DRINK_VODKA', 'CAN_PLAY_BALALAYKA'];
                    service.hasPrivileges(bulsitBingoArray, 'AND').then((value) => {
                        expect(value.length).toBe(3);
                    });
                });
            });

        });
    });

    // TODO: xdescribe('hasAnyAuthority()', () => {});

});
