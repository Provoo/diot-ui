import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../product';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subscription } from 'rxjs';
import { MqttService, IMqttMessage } from 'ngx-mqtt';
import { ApiService } from '../services/api.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  products: Product[] = []
  private subscription: Subscription
  public message: string
  panelOpenState = true
  diot = {}
  message2: string;
  subscription2: Subscription;
  alarm_on: string;
  alarm_on_sub: Subscription;
  temperature: string;
  temperature_sub: Subscription;
  smoke_sub: Subscription;
  smoke: any;
  active_alarm: string | Buffer = '1';
  alarm: boolean = false;
  alarm_sub: Subscription;

  tiles = [
    { data: '', icon:'thermometer', subtitle: 'Temperatura', cols: 1, rows: 1 },
    { data: '',icon:'water', subtitle: 'Humedad', cols: 1, rows: 1 },
    { data: '',icon:'nuclear', subtitle: 'Carbono ', cols: 2, rows: 1 },
    { data: '', icon:'nuclear', subtitle: 'Gas ', cols: 2, rows: 1 },
    { data: '', icon:'nuclear', subtitle: 'Humo ', cols: 2, rows: 1 },
    { data: '', icon: 'notifications', subtitle: 'Estatus de Alarma', cols: 1, rows: 1 },
    { data: 'Apagado', icon:'radio-button-off', subtitle: 'Alarma', cols: 1, rows: 1 },
  ];
  user: any;
  
  constructor(
    public api: ApiService,
    public loadingController: LoadingController,
    public router: Router,
    public route: ActivatedRoute,
    private _mqttService: MqttService
    ) {
     }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user'))
    console.log(this.user)
    this.api.getDiotsUser(this.user.id).subscribe(
      res => {
        this.diot = res[0]
        console.log(this.diot)
        this.getChanels()
      },
      err => {

      })
  }

  getChanels(){
    this.temperature_sub = this._mqttService.observe(
      this.diot['subcribers_topics']['temperature'])
      .subscribe(
        (message: IMqttMessage) => {
          let temperature = JSON.parse(message.payload.toString())
          this.tiles[0].data = Number(temperature.temperature).toFixed(2)
          this.tiles[1].data = Number(temperature.humidity).toFixed(2)
        });
    this.smoke_sub = this._mqttService.observe(
      this.diot['subcribers_topics']['smoke'])
      .subscribe(
        (message: IMqttMessage) => {
          let smoke = JSON.parse(message.payload.toString())
          this.tiles[2].subtitle = "Co " + Number(smoke.co).toFixed() + ' ppm'
          this.tiles[2].data = this.levels(Number(smoke.co).toFixed())
          this.tiles[3].subtitle = "Gas " +Number(smoke.lpg).toFixed() + ' ppm'
          this.tiles[3].data = this.levels(Number(smoke.lpg).toFixed())

          this.tiles[4].subtitle = "Humo " + Number(smoke.smoke).toFixed() + ' ppm'
          this.tiles[4].data = this.levels(Number(smoke.smoke).toFixed())
        });
    this.alarm_on_sub = this._mqttService.observe(
      this.diot['subcribers_topics']['alarm_on'])
      .subscribe(
        (message: IMqttMessage) => {
          this.tiles[5].data = message.payload.toString() === "1" ? "On" : "Off"
          this.tiles[5].icon = message.payload.toString() === "1" ? "notifications" : "notifications-off"
          if (message.payload.toString() === "0"){
            this.tiles[6].icon = 'radio-button-off'
            this.tiles[6].data = 'Apagado'
            this.alarm = false
            this.alarm_sub.unsubscribe();
          } 
          else{
            this.alarm = true
            this.alarm_sub = this._mqttService.observe(
              this.diot['subcribers_topics']['alarm'])
              .subscribe(
                (message: IMqttMessage) => {
                  this.tiles[6].data = message.payload.toString() === "1" ? 'Abierto' : 'Seguro'
                  this.tiles[6].icon = message.payload.toString() === "1" ? 'exit' : 'lock'
                });
          }
        });
    

    
  }

  levels(level){
    if (level > 10 && level < 50){
      return "Medio"
    }

    if (level > 50 &&  level < 1000) {
      return "Alto"
    }

    if (level > 1500) {
      return "Incendio"
    }

    return "Normal"

  }

  activeAlarm(){

    let activeOrNot = this.alarm! ? '0': '1'
    console.log(activeOrNot)
    this._mqttService.unsafePublish(this.diot['publish_topics']['alarm_on'], activeOrNot, { qos: 1, retain: true });
  }
  
}
