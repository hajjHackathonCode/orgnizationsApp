import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {EstimoteBeacons} from "@ionic-native/estimote-beacons";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import moment from 'moment';
import {LocalNotifications} from "@ionic-native/local-notifications";
import {MapsPage} from "../maps/maps";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  status = 0;
  taskTimer
  losts
  taskTimerDisposal;
  discoverTimer
  discoverTimerDisposal;
  beconTracker;
  beconTrackerDisposal
  listOfBeacons = [];
  listOfOutOfRangeBeacons = [
    "d640cd95516a",
    "dcabc717ed9e"];
  listOfOutOfRange  = [];

  constructor(private localNotifications: LocalNotifications, public navCtrl: NavController,private eb: EstimoteBeacons, private http : HttpClient) {
    this.eb.requestAlwaysAuthorization();

    this.taskTimer = Observable.interval(1000)
    this.beconTracker = Observable.interval(5000)
    this.discoverTimer = Observable.interval(5000)
    this.taskTimerDisposal = this.taskTimer.subscribe((val) => { this.refreshStatus() });
    this.discoverTimerDisposal = this.discoverTimer.subscribe((val) => { this.discoverBeacons() });

    this.eb.enableAnalytics(true);
    this.clickme()
// Schedule a single notification
//     this.localNotifications.schedule({
//       id: 1,
//       text: 'Single ILocalNotification',
//       sound:  'file://beep.caf',
//       data: { secret: "asdasd" }
//     });

  }
  findOnMap(lost){
    this.navCtrl.push(MapsPage,{"losts": this.losts})
  }


  refreshStatus(){
    this.http.get("http://198.211.119.242/HajjConnect/groups/getstatus/5b625b7a190a4f23ca0c072a").subscribe((data : any) => {
      console.log(data.response)
      if (data.response) {
        if (data.response.length > 0) {
          this.status = 2;
         } else {
          this.status = 1;
        }
        this.losts = data.response
        if(this.losts && this.losts.length > 0){
          this.losts.forEach(item => {
            item.lostPeriod = moment('2000-01-01 00:00:00').millisecond(item.lostPeriod + 1000).format("mm")

            ;
          })
        }

      }
    })
  }
  discoverBeacons(){
    // this.eb.startEstimoteBeaconDiscovery().subscribe(beacon => {
    //   console.log("beacon" ,JSON.stringify(beacon))
    //
    // })
  }
  clickme(){


    this.beconTrackerDisposal = this.beconTracker.subscribe((val) => {
      if(this.listOfBeacons.length > 0){
        console.log("beacon" )
        console.log("beacon",JSON.stringify(this.listOfBeacons) )

        this.http.post("http://198.211.119.242/HajjConnect/users/updateLocations",{ lat: 21.61749207451767,
          lon: 39.15538886498189,
          dir: "in", beaconsIds:  this.listOfBeacons }).subscribe(data => {
          this.listOfOutOfRangeBeacons.forEach(item =>{
              console.log("item",item)
            console.log("this.listOfBeacons[item]",this.listOfBeacons.find(x => x ==item))
            if(this.listOfBeacons.find(x => x ==item)){

            }else{
              this.listOfOutOfRange.push(item)

            }

          })
          this.http.post("http://198.211.119.242/HajjConnect/users/updateLocations",{ lat: 21.61749207451767,
            lon: 39.15538886498189,
            dir: "out", beaconsIds:  this.listOfOutOfRange }).subscribe(data => {
            this.listOfOutOfRange = [];


          })

          this.listOfBeacons = [];

        },(error) => {

            console.log("error",JSON.stringify(this.listOfBeacons))
            console.log("error",JSON.stringify(error))
        })

      }

    });

    this.eb.startEstimoteBeaconDiscovery().subscribe(beacons => {
      if(beacons){
         beacons.beacons.forEach( (beacon:any)=>{

           if(this.listOfBeacons.find(x=> x == beacon.macAddress) ){

          }else{
            this.listOfBeacons.push(beacon.macAddress)
          }


        })
      }


    })
  }
}
