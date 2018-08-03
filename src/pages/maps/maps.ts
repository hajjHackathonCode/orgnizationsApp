import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {GoogleMaps} from "../../providers/google-maps/google-maps";

/**
 * Generated class for the MapsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

 @Component({
  selector: 'page-maps',
  templateUrl: 'maps.html',
})
export class MapsPage {
  @ViewChild('map') mapElement: ElementRef;
  @ViewChild('pleaseConnect') pleaseConnect: ElementRef;
  hajjiData: any
  constructor(public platform: Platform, public maps: GoogleMaps, public navCtrl: NavController, public navParams: NavParams) {
    // console.log(JSON.stringify(this.navParams.get("losts")))
  }
  ionViewWillLeave(){
    this.maps.map= null;
  }
  ionViewDidEnter() {
    this.hajjiData = this.navParams.get("losts")

    console.log("person test" )


      this.platform.ready().then(() => {
        console.log("person test 2" )

        this.maps.init(this.mapElement.nativeElement, this.pleaseConnect.nativeElement).then(() => {
          this.hajjiData.forEach((person:any) => {
            console.log("person" , JSON.stringify(person.lastLocation))


            this.maps.addMarker(person.lastLocation.lat,person.lastLocation.lon, person.visitor.image)

          })


        });

      });




  }


}
