import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse} from '@ionic-native/background-geolocation';
import { AlertController } from 'ionic-angular';
import {Subject} from "rxjs/Subject";

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})

export class HomePage {

    loc: any;

    latlng: any[] = [];

    subject: any = new Subject();

    constructor(public navCtrl: NavController,
                public alertCtrl: AlertController,
                private backgroundGeolocation: BackgroundGeolocation,
                public platform: Platform) {
    }

    ngOnInit() {
        console.log("init was successfull")
    }

    getGeo() {

        const config: BackgroundGeolocationConfig = {
            desiredAccuracy: 0,
            stationaryRadius: 1,
            distanceFilter: 1,
            activitiesInterval: 1000,
            fastestInterval: 900,
            saveBatteryOnBackground: false,
            interval: 5000,
            debug: true, //  enable this hear sounds for background-geolocation life-cycle.
            stopOnTerminate: false, // enable this to clear background location settings when the app terminates
        };

        if (this.platform.is('cordova')) {

            console.log("You are testing on a device");

            this.backgroundGeolocation.configure(config).subscribe((location: BackgroundGeolocationResponse) => {

                console.log(location);

                this.latlng.push({locationId: location.locationId, lat: location.latitude, lng: location.longitude, time: location.time, speed: location.speed, accuracy: location.accuracy, bearing: location.bearing, coords: location.coords});

                this.subject.next(this.latlng);

                // IMPORTANT:  You must execute the finish method here to inform the native plugin that you're finished,
                // and the background-task may be completed.  You must do this regardless if your HTTP request is successful or not.
                // IF YOU DON'T, ios will CRASH YOUR APP for spending too much time in the background.
                // this.backgroundGeolocation.finish(); // FOR IOS ONLY

            });

            // start recording location
            this.backgroundGeolocation.start();

        } else {

            console.log("You are testing in the browser");

        }
    }

    stopGeo() {

        if (this.platform.is('cordova')) {

            // If you wish to turn OFF background-tracking, call the #stop method.
            this.backgroundGeolocation.stop();

        } else {

            console.log("You are testing in the browser");

        }
    }

    getGeoCordinats() {
        this.backgroundGeolocation.getLogEntries(100).then(x => {
            let alert = this.alertCtrl.create({
                title: 'gps track',
                subTitle: JSON.stringify(x),
                buttons: ['Zurück']
            });
            alert.present();
        });

    }
}
