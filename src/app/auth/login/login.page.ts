import { Component, OnInit } from '@angular/core';
import { ApiService} from '../../services/api.service'
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  user = {}
  constructor(
    private router: Router,
    private api: ApiService,
    public alrt: AlertController
  ) { }

  ngOnInit() {
  }
  login() {

    this.api.signIn(this.user['email'], this.user['password']).subscribe(
      res => {
        localStorage.setItem('token', res['key'])
        this.api.getUserToken().subscribe(res => {
          let user = res
          user['id'] = res['pk']
          delete user['pk']
          localStorage.setItem('user', JSON.stringify(user))
          this.router.navigate(['home'])
        })
        

      },
      err => {
        this.presentAlert()
      }
    )

  }
  async presentAlert() {
    const alert = await this.alrt.create({
      header: 'Alert',
      subHeader: 'Datos Incorrectos',
      message: 'Revisa tu usuario o contraseña',
      buttons: ['OK']
    });

    await alert.present();
  }

}
