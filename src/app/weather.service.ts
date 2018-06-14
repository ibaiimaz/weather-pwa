import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class WeatherService {
  private apiUrl: string;

  constructor(private httpClient: HttpClient) { }

  getCities (url: string) {
    return this.httpClient.get(url);
  }
}
