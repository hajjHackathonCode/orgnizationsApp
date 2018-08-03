import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { EstimoteBeacons } from '@ionic-native/estimote-beacons';
import {HttpClientModule} from "@angular/common/http";
import {MomentModule} from "angular2-moment";
import {LocalNotifications} from "@ionic-native/local-notifications";
import { GoogleMaps } from '../providers/google-maps/google-maps';
import { Connectivity } from '../providers/connectivity/connectivity';
import MapPanes = google.maps.MapPanes;
import {MapsPage} from "../pages/maps/maps";
import { Network } from '@ionic-native/network';
import {Geolocation} from '@ionic-native/geolocation';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    LoginPage,
    TabsPage,
    MapsPage

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    MomentModule,


  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    LoginPage,
    MapsPage
  ],
  providers: [
    StatusBar,
     LocalNotifications,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    EstimoteBeacons,
    GoogleMaps,
    Connectivity,
    Geolocation,
    Network
  ]
})
export class AppModule {}
