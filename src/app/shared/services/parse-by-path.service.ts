import { Injectable } from '@angular/core';

@Injectable()
export class ParseByPathService {

    constructor() {}

    parse(obj: any = {}, path: string = ''): any {
        let pathArr = path.split('.');
        if (pathArr.length > 1) {
            return this.parse(obj[pathArr.shift()], pathArr.join('.'));
        } else  {
            return path ? (obj.hasOwnProperty(path) ? obj[path] : null) : obj;
        }
    }

}
