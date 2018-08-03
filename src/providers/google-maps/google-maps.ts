import {Injectable, NgZone} from '@angular/core';
import {Connectivity} from "../connectivity/connectivity";
import {Geolocation} from '@ionic-native/geolocation';
 import 'rxjs/add/operator/map';
import {Subject} from "rxjs";
import {LoadingController} from "ionic-angular";
import {mapIcons} from "../../models/mapIcons";

@Injectable()
export class GoogleMaps {

  mapElement: any;
  pleaseConnect: any;
  map: any;
  mapInitialised: boolean = false;

  apiKey: string = "AIzaSyD8kx5L0jcg7nnj-cVS_tGg7Iq4mID1onY";
  mapBounds
  activeMarker
  activeMarkerDetails
  public markers: any[] = [];
   markerCluster: any = null;
  mapCurrentLocation
  locationMarker
  public doNotUpdateMapMarkers = false;
   public activeMarkerSubject = new Subject<any>();
  public activeMapRoutePlan = new Subject<any>();

  public currentBusRoute;


  constructor(public connectivityService: Connectivity,private geolocation: Geolocation,
              private zone: NgZone,public loading: LoadingController) {

  }

  init(mapElement: any, pleaseConnect: any): Promise<any> {

    this.mapElement = mapElement;
    this.pleaseConnect = pleaseConnect;

    return this.loadGoogleMaps();



  }


  startLoading(text) {
    let loader = this.loading.create({
      content: text,
    });
    loader.present().then(() => {
    });
    return loader;
  }
  stopLoading(loader){
    loader.dismiss();
  }

  loadGoogleMaps(): Promise<any> {

    return new Promise((resolve) => {

      if(typeof google == "undefined" || typeof google.maps == "undefined"){

        console.log("Google maps JavaScript needs to be loaded.");
        this.disableMap(); 

        if(this.connectivityService.isOnline()){

          window['mapInit'] = () => {

            this.initMap().then((map) => {
              resolve(map);
            });

            this.enableMap();
          }

          let script = document.createElement("script");
          script.id = "googleMaps";

          if(this.apiKey){
            script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
          } else {
            console.log("no maps key")
            script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
          }

          document.body.appendChild(script);

        }
      }
      else {

        if(this.connectivityService.isOnline()){
          this.initMap();
          this.enableMap();
        }
        else {
          this.disableMap();
        }

      }

      this.addConnectivityListeners();

    });

  }

  initMap(): Promise<any> {





    this.mapInitialised = true;

    return new Promise((resolve) => {

      this.geolocation.getCurrentPosition().then((position) => {

        //let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        this.mapCurrentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let mapOptions = {
          center: this.mapCurrentLocation,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          disableDefaultUI: true
        }

        this.map = new google.maps.Map(this.mapElement, mapOptions);
        google.maps.event.addListenerOnce(this.map, 'idle', () => {
          // mapEle.classList.add('show-map');
          this.mapBounds = new google.maps.LatLngBounds();
        });
        google.maps.event.addListener(this.map, 'bounds_changed', (data) => {



        });
        google.maps.event.addListener(this.map, 'click', (data) => {
          this.deselectMarker()

          this.zone.run(() => {
            // this.keyboard.close();
          });
        });

        this.CreateUserCurrentLocationMarker()

        resolve(this.map);

      });

    });

  }
  CreateUserCurrentLocationMarker(){
    this.locationMarker = new google.maps.Marker({
      map: this.map,
      icon: mapIcons.blue_pin,
      animation: google.maps.Animation.DROP,
      position: this.mapCurrentLocation,
    });

    this.geolocation.watchPosition().subscribe((position) => {
      this.mapCurrentLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

      this.locationMarker.setPosition(this.mapCurrentLocation);

    })
  }
  addMarker(latitude, longitude,img) {


    let image = {
      size: new google.maps.Size(220, 220),
      scaledSize: new google.maps.Size(32, 32),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(16, 16),


      url: `data:image/jpeg;base64,${img}`,

    };
    let latLng = new google.maps.LatLng(latitude, longitude);

    let marker = new google.maps.Marker({
      animation: google.maps.Animation.DROP,
      position: latLng,
      // icon: mapIcons.purple_pin,
      icon: image ,

    });

    marker.setMap(this.map)
    marker.addListener('click', () => {
     });
    this.markers.push(marker);







    return marker;
  }

  deselectMarker(){
    if (this.activeMarker) {
      this.activeMarker.setIcon(mapIcons.purple_pin);
    }

    this.activeMarkerSubject.next(null);
    this.zone.run(() => {
    });

  }
  disableMap(): void {

    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "block";
    }

  }

  enableMap(): void {

    if(this.pleaseConnect){
      this.pleaseConnect.style.display = "none";
    }

  }

  addConnectivityListeners(): void {

    this.connectivityService.watchOnline().subscribe(() => {

      console.log("online");

      setTimeout(() => {

        if(typeof google == "undefined" || typeof google.maps == "undefined"){
          this.loadGoogleMaps();
        }
        else {
          if(!this.mapInitialised){
            this.initMap();
          }

          this.enableMap();
        }

      }, 2000);

    });

    this.connectivityService.watchOffline().subscribe(() => {

      console.log("offline");

      this.disableMap();

    });

  }





   panToCurrentLocation() {
    this.map.panTo(this.mapCurrentLocation);
  }


}
