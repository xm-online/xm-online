import {Injectable} from '@angular/core';
import {TranslatePartialLoader, JhiLanguageService} from 'ng-jhipster';
import {Observable} from 'rxjs';

@Injectable()
export class CustomTranslatePartialLoader {

    constructor(private jhiLanguageService: JhiLanguageService) {

    }

    files: any = {};

    init() {
        let self = this;
        TranslatePartialLoader.prototype.getTranslation = function (lang) {
            let _this = this;
            let combinedObject = new Object();
            let oldObsevers;
            let newObserver;
            this.locations.forEach(function (value) {
                newObserver = self.getFile(_this, value, combinedObject, lang);
                if (oldObsevers == null) {
                    oldObsevers = newObserver;
                } else {
                    oldObsevers = oldObsevers.merge(newObserver);
                }
            });
            return oldObsevers;
        };

    }

    fileInProgressLoading = {};

    private getFile(_this, part, combinedObject, lang) {
        let self = this;
        let fileUrl = _this.prefix + "/" + lang + "/" + part + _this.suffix;
        if (self.files[fileUrl]) {
            self.parseFile(self.files[fileUrl], combinedObject);
            return Observable.of(combinedObject);
        }
        return Observable.create(function (observer) {

            let promise;
            if (self.fileInProgressLoading[fileUrl]) {
                promise = self.fileInProgressLoading[fileUrl];
            } else {
                promise = _this.http.get(fileUrl).toPromise();
                self.fileInProgressLoading[fileUrl] = promise;
            }

            promise.then(function (res) {
                let responseObj = res.json();
                self.files[fileUrl] = responseObj;
                self.parseFile(responseObj, combinedObject);
                observer.next(combinedObject);
                observer.complete();
                self.jhiLanguageService.reload();
                setTimeout(function() {
                    self.jhiLanguageService.reload();
                }, 3000);
            });

        });
    };

    private parseFile(responseObj: any, combinedObject) {
        let self = this;
        Object.keys(responseObj).forEach(function (key) {
            if (!combinedObject[key]) {
                combinedObject[key] = responseObj[key];
            } else {
                self.mergeObjects(combinedObject[key], responseObj[key]);
            }
        });
    }

    private mergeObjects(combinedObject, partObject) {
        for (let key in partObject) {

            if (!combinedObject[key]) {
                combinedObject[key] = partObject[key];
                continue;
            }

            if (typeof partObject[key] == 'object') {
                this.mergeObjects(combinedObject[key], partObject[key]);
            } else {
                combinedObject[key] = partObject[key];
            }
        }
    }

}




