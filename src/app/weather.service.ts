import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class WeatherService {
  private apiUrl: string;

  constructor(private httpClient: HttpClient) { }

  getCities (key: string) {
    const statement = 'select * from weather.forecast where woeid=' + key;
    const url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + statement;
    return this.httpClient.get(url);
  }
}
