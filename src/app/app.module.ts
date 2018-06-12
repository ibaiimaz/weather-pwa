import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-boot-modal';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { CardComponent } from './card/card.component';
import { CityModalComponent } from './city-modal/city-modal.component';

import { WeatherService } from './weather.service';

@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    CityModalComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ModalModule,
    ReactiveFormsModule
  ],
  providers: [
    WeatherService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
