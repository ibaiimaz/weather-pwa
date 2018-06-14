import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { CityModalComponent } from './city-modal/city-modal.component';
import { WeatherService } from './weather.service';

const initialWeatherForecast = {
  key: '2459115',
  label: 'New York, NY',
  created: '2016-07-22T01:00:00Z',
  channel: {
    astronomy: {
      sunrise: '5:43 am',
      sunset: '8:21 pm'
    },
    item: {
      condition: {
        text: 'Windy',
        date: 'Thu, 21 Jul 2016 09:00 PM EDT',
        temp: 56,
        code: 24
      },
      forecast: [
        {code: 44, high: 86, low: 70},
        {code: 44, high: 94, low: 73},
        {code: 4, high: 95, low: 78},
        {code: 24, high: 75, low: 89},
        {code: 24, high: 89, low: 77},
        {code: 44, high: 92, low: 79},
        {code: 44, high: 89, low: 77}
      ]
    },
    atmosphere: {
      humidity: 56
    },
    wind: {
      speed: 25,
      direction: 195
    }
  }
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges {
  title = 'app';
  selectedCities: any[];
  cards = [];
  loading = true;
  @ViewChild(CityModalComponent) cityModal: CityModalComponent;

  constructor(
    private weatherService: WeatherService
  ) {}

  ngOnInit() {
    // this.updateForecastCard(initialWeatherForecast);
    this.loading = false;

    this.selectedCities = localStorage.selectedCities;
    if (this.selectedCities) {
      this.selectedCities = JSON.parse(this.selectedCities.toString());
      this.selectedCities.forEach((city) => this.getForecast(city.key, city.label));
    } else {
      /* The user is using the app for the first time, or the user has not
       * saved any cities, so show the user some fake data. A real app in this
       * scenario could guess the user's location via IP lookup and then inject
       * that data into the page.
       */
      this.updateForecastCard(initialWeatherForecast);
      this.selectedCities = [
        {key: initialWeatherForecast.key, label: initialWeatherForecast.label}
      ];
      this.saveSelectedCities();
    }
  }

  ngOnChanges() {
    console.log('cards', this.cards);
    console.log('selectedCities', this.selectedCities);
  }

  onOpenModal() {
    this.cityModal.open();
  }

  onAdd(city: any) {
    this.getForecast(city.id, city.name);
    this.selectedCities.push({key: city.id, label: city.name});
    this.saveSelectedCities();
  }

  updateForecastCard(data: any) {
    const index = this.cards.findIndex(c => c.key === data.key);
    if (index === -1) {
      this.cards.push(data);
    } else {
      const dataLastUpdated = new Date(data.created);
      const cardLastUpdated = new Date(this.cards[index].created);

      if (cardLastUpdated && dataLastUpdated.getTime() < cardLastUpdated.getTime()) {
        return;
      }
      this.cards[index] = data;
    }
  }

  saveSelectedCities() {
    const selectedCities = JSON.stringify(this.selectedCities);
    localStorage.selectedCities = selectedCities;
  }

  async getForecast(key, label) {
    try {
      console.log('city', key);

      const statement = 'select * from weather.forecast where woeid=' + key;
      const url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' + statement;

      if ('caches' in window) {
        /*
         * Check if the service worker has already cached this city's weather
         * data. If the service worker has the data, then display the cached
         * data while the app fetches the latest data.
         */
        caches.match(url).then(function(respons) {
          if (respons) {
            respons.json().then(function updateFromCache(json) {
              const resul = json.query.results;
              resul.key = key;
              resul.label = label;
              resul.created = json.query.created;
              this.updateForecastCard(resul);
            });
          }
        });
      }

      this.updateForecastCard(initialWeatherForecast);

      const resp = await this.weatherService.getCities(url).toPromise();
      console.log('resp', (<any>resp).query.results);
      const response = (<any>resp);
      const results = response.query.results;
      results.key = key;
      results.label = label;
      results.created = response.query.created;
      this.updateForecastCard(results);
    } catch (error) {
      console.log('error', error);
    }
  }

  getForecast2(key, label) {
    const statement = 'select * from weather.forecast where woeid=' + key;
    const url = 'https://query.yahooapis.com/v1/public/yql?format=json&q=' +
        statement;
    // TODO add cache logic here

    // Fetch the latest data.
    const request = new XMLHttpRequest();
    request.onreadystatechange = () => {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          const response = JSON.parse(request.response);
          const results = response.query.results;
          results.key = key;
          results.label = label;
          results.created = response.query.created;
          this.updateForecastCard(results);
        }
      } else {
        // Return the initial weather forecast since no data is available.
        this.updateForecastCard(initialWeatherForecast);
      }
    };
    request.open('GET', url);
    request.send();
  }
}
