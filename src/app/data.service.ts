import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  getGeoData(){
    const data_url = 'assets/dangerIntersection.geojson';
    return this.http.get(data_url);
  }
}
