import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocationService } from '../../providers/location-service';
import { AlertController } from 'ionic-angular';
declare var google;
/**
* Generated class for the ChoosingPage page.
*
* See http://ionicframework.com/docs/components/#navigation for more info
* on Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-choosing-page',
  templateUrl: 'choosing-page.html'
})
export class ChoosingPage {
    copySources: { title: string; position: any; }[]; copyDests: any[];
  sources: Array<{ title: string, position: any }>;
  dests: Array<{ title: string, position: any }>;
  sourceLoc: any;
  destLoc: any;
  srcCallBack: any;
  destCallBack: any;
  goCallBack: any;
  mapPage: any;
  googleObj: any;
  floor: any;
  floorsData: any;
  gotFloors: any;
  showDestList: any;
  showSrcList: any;
  globalSrc: any;
  globalDest: any;
  firstSrc: any;
  firstDest: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public locService: LocationService,
    public alertCtrl: AlertController) {
    this.googleObj = navParams.get('googleObj');
    this.sources = [];
    this.dests = [];
    this.gotFloors = false;
    this.showDestList = false;
    this.showSrcList = false;
    this.firstSrc = true
    this.firstDest = true;
    locService.getLocations(this.sources, this.dests, this.googleObj);
    this.floorsData = [];
    locService.getFloors(this.floorsData, this);
    this.mapPage = navParams.get('mapPage');
    google.maps.event.clearListeners(this.mapPage.mapView, 'mousemove');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChoosingPage');
  }
  goback() {
    console.log("here");
    this.mapPage.go();
    this.navCtrl.pop();
  }

  getItemsDest(ev: any) {
    let val = ev.target.value;
     if (this.firstDest == true) {
        this.firstDest = false;
        this.globalDest = this.dests.slice(); 
    }
    if (val && val.trim != '') {
      this.copyDests = this.globalDest.slice();
      this.dests = this.copyDests.filter((p) => {
        return (p.title.toLowerCase().startsWith(val.toLowerCase()));
      });
      this.showDestList = true;
    } else {
      this.showDestList = false;
    }
  }


  getItemsSrc(ev: any) {
    let val = ev.target.value;
    if (this.firstSrc == true) {
        this.firstSrc = false;
        this.globalSrc = this.sources.slice(); 
    }
    if (val && val.trim != '') {
      this.copySources = this.globalSrc.slice();
      this.sources = this.copySources.filter((p) => {
        return (p.title.toLowerCase().startsWith(val.toLowerCase()));
      });
      this.showSrcList = true;
    } else {
      this.showSrcList = false;
    }
  }


  showRadio(dict): Promise<boolean> {
    let pageObj = this;
    return new Promise((resolve, reject) => {
      let alert = this.alertCtrl.create();
      alert.setTitle('Choose Floor');
      for (var i = 0; i < dict.length; i += 1) {
        alert.addInput({
          type: 'radio',
          label: dict[i]["id"],
          value: dict[i],
          checked: false
        });
      }
      alert.addButton('Cancel');
      alert.addButton({
        text: 'OK',
        handler: data => {
          resolve(true);
          console.log(data);
          pageObj.floor = data;
        }
      });
      alert.present();
    });
  }

  rememberDest(dict: any) {
    let page = this;
    if (this.floorsData[dict["title"]].length == 0) {
      this.mapPage.setDstPosition(dict["position"], dict["title"]);
      return;
    }
    this.showRadio(this.floorsData[dict["title"]]).then((result) => {
      console.log(page.floor);
      this.mapPage.setDstPosition(dict["position"], dict["title"]);
      this.mapPage.setIndoorDescription(this.floor);
    })
  }

  rememberSrc(dict: any) {
    this.mapPage.setSrcPosition(dict["position"], dict["title"]);
  }

  changeToRecord(value: any) {
    this.mapPage.wantRecordRoute = value.checked;
  }
  changeToSimulation(value: any) {
    this.mapPage.simulationMode = value.checked;
  }
}
