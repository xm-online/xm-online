import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class OverpassApiService {

    OVERPASS_API_URL = 'https://www.overpass-api.de';

    /**
     * @param {Object} http angular http service
     */
    constructor(private http: HttpClient) {
    }

    /**
     * @param {Object/String} query
     * http://wiki.openstreetmap.org/wiki/FR:Overpass_API
     * @return {Observable} http.get
     */
    overpass(query: string): Observable<any> {
        return this.http.get(this.OVERPASS_API_URL + '/api/interpreter?data=' + query);
    }

    /**
     * Returns list with OSM objects by start term of name and where type is boundary
     * @param {String} name
     * @return {Observable} http.get
     */
    public getBoundariesByName(name): Observable<any> {
        return this.overpass(`[out:json];rel[~"name"~"^${name}",i]["type"="boundary"];out body;`);
    }

    /**
     * Returns geometry for the relation by OSM Id
     * @param {String} osmId
     * @return {Observable} http.get
     */
    public getRelGeom(osmId): Observable<any> {
        return this.overpass(`[out:json];rel(${osmId});out geom;`);
    }

}
